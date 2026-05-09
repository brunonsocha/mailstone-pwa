import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import L from "leaflet";
import {
  addDoc,
  collection,
  getDocs,
  GeoPoint,
  serverTimestamp,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { ref as sRef, uploadBytes, getDownloadURL } from "firebase/storage";

const mapPinDoc = (snapshot) => {
  if (!snapshot.exists()) return null;

  const data = snapshot.data();

  return {
    id: snapshot.id,
    ownerUid: data.ownerUid,
    createdAt: data.createdAt,
    lat: data.location.latitude,
    lng: data.location.longitude,
    type: data.type || "text",
    content: data.content || "",
  };
};

export const useLeafletMap = ({ user, rangeMeters = 500 } = {}) => {
  const mapEl = ref(null);
  const userCoords = ref(null);
  const selectedPin = ref(null);
  const statusMessage = ref("");
  const pins = ref([]);

  let map;
  let userMarker;
  let userRangeCircle;
  const pinMarkers = new Map();

  const canShareSelectedPin = computed(() => Boolean(selectedPin.value));

  const userIcon = L.divIcon({
    className: "soapstone-user-dot",
    html: "<span></span>",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });

  const pinIcon = L.divIcon({
    className: "soapstone-pin",
    html: "",
    iconSize: [24, 24],
    iconAnchor: [12, 24],
  });

  const getAllPins = async () => {
    const pinsQuery = await getDocs(collection(db, "pins"));
    return pinsQuery.docs.map(mapPinDoc).filter(Boolean);
  };

  const getDistanceToPin = (pin) => {
    if (!map || !userCoords.value) return null;

    return map.distance(
      [userCoords.value.lat, userCoords.value.lng],
      [pin.lat, pin.lng],
    );
  };

  const isPinInRange = (pin) => {
    const distance = getDistanceToPin(pin);
    return distance !== null && distance <= rangeMeters;
  };

  const updateUserLocation = (event) => {
    const { lat, lng } = event.latlng;
    userCoords.value = { lat, lng, accuracy: event.accuracy };

    if (!userMarker) {
      userMarker = L.marker([lat, lng], {
        icon: userIcon,
        interactive: false,
      }).addTo(map);
    } else {
      userMarker.setLatLng([lat, lng]);
    }

    if (!userRangeCircle) {
      userRangeCircle = L.circle([lat, lng], {
        radius: rangeMeters,
        color: "#ffcc00",
        weight: 2,
        fillColor: "#ff8c00",
        fillOpacity: 0.18,
      }).addTo(map);
    } else {
      userRangeCircle.setLatLng([lat, lng]);
      userRangeCircle.setRadius(rangeMeters);
    }

    if (!selectedPin.value) {
      map.setView([lat, lng], 16);
    }
  };

  const selectPin = (pin, marker) => {
    if (!isPinInRange(pin)) {
      selectedPin.value = null;
      statusMessage.value = "Podejdź bliżej. Pinezka jest poza Twoim zasięgiem";
      return;
    }

    selectedPin.value = pin;
    statusMessage.value = "";
  };

  const addPin = (pin) => {
    if (!map || pinMarkers.has(pin.id)) return;

    const marker = L.marker([pin.lat, pin.lng], { icon: pinIcon }).addTo(map);
    marker.on("click", () => selectPin(pin, marker));
    pinMarkers.set(pin.id, marker);
  };

  const setPins = (nextPins) => {
    pinMarkers.forEach((marker) => marker.remove());
    pinMarkers.clear();
    pins.value = nextPins;
    nextPins.forEach(addPin);
  };

  const loadPins = async () => {
    if (!user.value?.uid) return;

    const allPins = await getAllPins();
    setPins(allPins);
  };

  watch(
    () => user.value?.uid,
    async (uid) => {
      if (!uid) {
        setPins([]);
        selectedPin.value = null;
        statusMessage.value = "";
        return;
      }

      await loadPins();
    },
    { immediate: true },
  );

  const centerOnUser = () => {
    if (map && userCoords.value) {
      map.setView([userCoords.value.lat, userCoords.value.lng], 16);
    }
  };

  const closeSelectedPin = () => {
    selectedPin.value = null;
  };

  const savePinToFirestore = async (type, content) => {
    const docRef = await addDoc(collection(db, "pins"), {
      createdAt: serverTimestamp(),
      location: new GeoPoint(userCoords.value.lat, userCoords.value.lng),
      ownerUid: user.value.uid,
      type: type,
      content: content,
    });

    const newPin = {
      id: docRef.id,
      ownerUid: user.value.uid,
      lat: userCoords.value.lat,
      lng: userCoords.value.lng,
      type,
      content,
    };

    pins.value.push(newPin);
    addPin(newPin);
    selectedPin.value = newPin;
    centerOnUser();
  };

  const createPinHere = async (type) => {
    if (!userCoords.value) {
      statusMessage.value = "Najpierw pozwól aplikacji pobrać lokalizację";
      return;
    }

    if (!user.value?.uid) {
      statusMessage.value = "Zaloguj się ponownie.";
      return;
    }

    if (type === "text") {
      const msg = prompt("Wpisz swoją wiadomość:");
      if (msg) await savePinToFirestore("text", msg);
    } else if (type === "image") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.capture = "environment";

      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        statusMessage.value = "Przesyłanie obrazu...";
        const fileRef = sRef(
          storage,
          `pins/${user.value.uid}/${Date.now()}_${file.name}`,
        );

        try {
          await uploadBytes(fileRef, file);
          const url = await getDownloadURL(fileRef);
          await savePinToFirestore("image", url);
          statusMessage.value = "Obraz zapisany!";
        } catch (err) {
          statusMessage.value = "Błąd przesyłania.";
        }
      };
      input.click();
    } else if (type === "voice") {
      statusMessage.value = "Nagrywanie głosowe będzie dostępne wkrótce.";
    }
  };

  const shareSelectedPin = async () => {
    if (!selectedPin.value) return;

    const url = `${window.location.origin}${window.location.pathname}?pin=${selectedPin.value.id}`;

    if (navigator.share) {
      await navigator.share({
        title: "Soapstone pin",
        text: "Find my pin",
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      statusMessage.value = "Link skopiowany.";
    }
  };

  const reportSelectedPin = async (matter) => {
    if (!selectedPin.value) {
      statusMessage.value = "Select a pin first.";
      return;
    }

    if (!user.value?.uid) {
      statusMessage.value = "Log in again.";
      return;
    }

    try {
      await addDoc(collection(db, "reports"), {
        createdAt: serverTimestamp(),
        matter,
        pinId: selectedPin.value.id,
        reporterId: user.value.uid,
      });

      statusMessage.value = "Report sent.";
      closeSelectedPin();
    } catch (err) {
      console.error(err);
      statusMessage.value = "Could not send report.";
    }
  };

  onMounted(async () => {
    map = L.map(mapEl.value).setView([50.0647, 19.945], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    map.on("locationfound", updateUserLocation);
    map.on("locationerror", () => {
      statusMessage.value = "Nie udało się pobrać lokalizacji";
    });

    map.locate({
      watch: true,
      setView: false,
      maxZoom: 16,
      enableHighAccuracy: true,
    });

    await loadPins();
  });

  onUnmounted(() => {
    if (!map) return;

    pinMarkers.forEach((marker) => marker.remove());
    pinMarkers.clear();
    map.stopLocate();
    map.remove();
    map = null;
  });

  return {
    mapEl,
    userCoords,
    selectedPin,
    statusMessage,
    pins,
    canShareSelectedPin,
    centerOnUser,
    closeSelectedPin,
    createPinHere,
    shareSelectedPin,
    loadPins,
  };
};
