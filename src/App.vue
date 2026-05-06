<template>
  <div class="app-container">
    <Transition name="fade" mode="out-in">
      
      <div v-if="!user" key="login" class="login-wrapper text-center">
        <h1 class="soapstone-title">Orange Soapstone</h1>
        <p class="subtitle">Brunon & Filip</p>
        <div class="auth-box shadow">
          <div class="mb-4">
            <input v-model="email" type="email" class="form-control form-control-custom" placeholder="Email">
            <input v-model="password" type="password" class="form-control form-control-custom" placeholder="Password">
          </div>
          <div class="d-grid gap-2">
            <div class="d-flex gap-2">
              <button @click="emailLogin" class="btn btn-orange py-2 flex-grow-1">ENTER</button>
              <button @click="emailRegister" class="btn btn-orange py-2 flex-grow-1">REGISTER</button>
            </div>
  
              <button @click="googleLogin" class="btn btn-google py-2">
                <img src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png" width="18" class="me-2">
                Sign in with Google
              </button>
            </div>
          <p v-if="error" class="error-msg mt-3">{{ error }}</p>
        </div>
      </div>

      <div v-else-if="isLoading" key="loading" class="text-center">
        <h2 class="soapstone-title">Loading...</h2>
      </div>

      <div v-else-if="!nicknameSet" key="setup" class="setup-nick text-center p-4">
        <h1 class="soapstone-title">Choose your name</h1>
        <p class="subtitle">How do you want to be known?</p>
        <div class="auth-box shadow mx-auto">
          <input v-model="tempNickname" type="text" class="form-control form-control-custom mb-3" placeholder="Enter Nickname...">
          <button @click="saveNickname" class="btn btn-orange w-100">CONFIRM</button>
          <p v-if="nickError" class="error-msg mt-2">{{ nickError }}</p>
        </div>
      </div>

      <div v-else key="app" class="content-wrapper text-center p-4">
        <h2 class="soapstone-title">Welcome!</h2>
        <div class="user-info my-4">
          <p class="mb-1">Greetings, <strong class="text-orange">{{ nickname }}</strong></p>
          <small class="text-muted">{{ user.email }}</small>
        </div>
        
        <div class="map-placeholder border border-warning rounded p-5 mb-4">
          TODO: IMPLEMENT THE MAP HERE
        </div>

        <button @click="logout" class="btn btn-outline-danger px-4 btn-sm">Leave</button>
      </div>

    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { auth, googleProvider, db } from './firebase'
import { onAuthStateChanged, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore' 

const user = ref(null)
const email = ref('')
const password = ref('')
const error = ref('')

const nickname = ref('')
const tempNickname = ref('')
const nicknameSet = ref(false)
const nickError = ref('')
const isLoading = ref(true) 

onMounted(() => {
  onAuthStateChanged(auth, async (currentUser) => {
    user.value = currentUser
    if (currentUser) {
      await fetchUserNickname(currentUser.uid)
    } else {
      nicknameSet.value = false
      nickname.value = ''
    }
    isLoading.value = false 
  })
})

const emailRegister = async () => {
  if (password.value.length < 6) {
    error.value = "Use a longer password."
    return
  }
  
  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value)
  } catch (err) {
    console.error(err.code)
    if (err.code === 'auth/email-already-in-use') {
      error.value = "That email is already taken."
    } else {
      error.value = "Registration failed."
    }
  }
}

const fetchUserNickname = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid))
    if (userDoc.exists()) {
      nickname.value = userDoc.data().nickname
      nicknameSet.value = true
    } else {
      nicknameSet.value = false
    }
  } catch (err) {
    console.error("Firestore Error:", err)
    error.value = "Access denied"
  }
}

const saveNickname = async () => {
  if (tempNickname.value.length < 3) {
    nickError.value = "Name must be at least 3 characters."
    return
  }
  
  try {
    await setDoc(doc(db, "users", user.value.uid), {
      nickname: tempNickname.value,
      email: user.value.email,
      role: 'traveler',
      joinedAt: new Date()
    })
    
    nickname.value = tempNickname.value
    nicknameSet.value = true
  } catch (err) {
    nickError.value = "Permission denied"
    console.log(err)
  }
}

const googleLogin = async () => {
  try {
    await signInWithPopup(auth, googleProvider)
  } catch (err) {
    error.value = "Google Login Error"
  }
}

const emailLogin = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
  } catch (err) {
    error.value = "Invalid credentials"
  }
}

const logout = () => {
  signOut(auth)
  nicknameSet.value = false
}
</script>