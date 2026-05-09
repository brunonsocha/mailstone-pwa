<template>
  <div class="recorder-overlay" @click.self="handleCancel">
    <div class="recorder-panel">
      <p class="recorder-title">Voice Message</p>
      <p class="recorder-status">{{ statusText }}</p>
      <p v-if="errorMessage" class="recorder-error">{{ errorMessage }}</p>

      <audio v-if="previewUrl" :src="previewUrl" controls class="recorder-audio"></audio>

      <div class="recorder-actions">
        <button v-if="!isRecording && !audioBlob" type="button" class="btn btn-orange" @click="startRecording">
          Start recording
        </button>

        <button v-if="isRecording" type="button" class="btn btn-outline-light" @click="stopRecording">
          Stop recording
        </button>

        <button v-if="audioBlob" type="button" class="btn btn-orange" @click="emitSave">
          Save message
        </button>

        <button v-if="audioBlob" type="button" class="btn btn-outline-light" @click="resetRecording">
          Record again
        </button>

        <button type="button" class="btn btn-outline-light" @click="handleCancel">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onUnmounted, ref } from "vue";

const emit = defineEmits(["save", "cancel"]);

const isRecording = ref(false);
const audioBlob = ref(null);
const previewUrl = ref("");
const errorMessage = ref("");

let mediaRecorder = null;
let mediaStream = null;
let chunks = [];

const statusText = computed(() => {
  if (isRecording.value) return "Recording in progress...";
  if (audioBlob.value) return "Preview your recording or save it.";
  return "Tap start to record a voice message.";
});

const cleanupStream = () => {
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop());
    mediaStream = null;
  }
};

const revokePreviewUrl = () => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = "";
  }
};

const startRecording = async () => {
  errorMessage.value = "";
  revokePreviewUrl();
  audioBlob.value = null;
  chunks = [];

  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(mediaStream);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: mediaRecorder.mimeType || "audio/webm" });
      chunks = [];
      if (!blob.size) return;
      audioBlob.value = blob;
      previewUrl.value = URL.createObjectURL(blob);
      cleanupStream();
    };

    mediaRecorder.start();
    isRecording.value = true;
  } catch (error) {
    cleanupStream();
    errorMessage.value = "Microphone permission was denied or unavailable.";
  }
};

const stopRecording = () => {
  if (!mediaRecorder || mediaRecorder.state !== "recording") return;

  mediaRecorder.stop();
  isRecording.value = false;
};

const resetRecording = () => {
  revokePreviewUrl();
  audioBlob.value = null;
  errorMessage.value = "";
  chunks = [];
};

const emitSave = () => {
  if (!audioBlob.value) return;
  emit("save", audioBlob.value);
};

const handleCancel = () => {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
  }

  cleanupStream();
  revokePreviewUrl();
  emit("cancel");
};

onUnmounted(() => {
  cleanupStream();
  revokePreviewUrl();
});
</script>

<style scoped>
.recorder-overlay {
  position: absolute;
  inset: 0;
  z-index: 3100;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  background: var(--app-overlay-strong);
}

.recorder-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  width: 100%;
  min-height: 100%;
  padding: 24px;
  background: var(--app-brown);
  border: 1px solid var(--app-panel-border);
}

.recorder-title {
  margin: 0;
  font-size: 1.25rem;
  color: var(--app-orange);
}

.recorder-status,
.recorder-error {
  margin: 0;
}

.recorder-error {
  color: var(--app-yellow);
}

.recorder-audio {
  width: 100%;
}

.recorder-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

@media (max-width: 720px) {
  .recorder-overlay {
    position: fixed;
    inset: 0;
  }

  .recorder-panel {
    padding: 16px;
  }

  .recorder-actions {
    flex-direction: column;
  }
}
</style>
