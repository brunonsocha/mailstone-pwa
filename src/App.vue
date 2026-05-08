<template>
  <div class="app-container">
    <Transition name="fade" mode="out-in">
      <LoginPanel
        v-if="!user"
        v-model:email="email"
        v-model:password="password"
        :error="error"
        @standard-login="emailLogin"
        @register="emailRegister"
        @google-login="googleLogin"
      />
      <!-- <div v-if="!user" key="login" class="login-wrapper text-center">
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
      </div> -->

      <div v-else-if="isLoading" key="loading" class="text-center">
        <h2 class="soapstone-title">Loading...</h2>
      </div>

      <NicknameSetup
        v-else-if="!nicknameSet"
        v-model:nickname="tempNickname"
        :error="nickError"
        @save="saveNickname"
      />

      <!-- <div v-else-if="!nicknameSet" key="setup" class="setup-nick text-center p-4">
        <h1 class="soapstone-title">Choose your name</h1>
        <p class="subtitle">How do you want to be known?</p>
        <div class="auth-box shadow mx-auto">
          <input v-model="tempNickname" type="text" class="form-control form-control-custom mb-3" placeholder="Enter Nickname...">
          <button @click="saveNickname" class="btn btn-orange w-100">CONFIRM</button>
          <p v-if="nickError" class="error-msg mt-2">{{ nickError }}</p>
        </div>
      </div> -->

      <HomePanel v-else :user="user" :nickname="nickname" @logout="logout" />
    </Transition>
  </div>
</template>

<script setup>
import LoginPanel from "./components/LoginPanel.vue";
import NicknameSetup from "./components/NicknameSetup.vue";
import HomePanel from "./components/HomePanel.vue";
import { useAuth } from "./composables/useAuth";

const {
  user,
  email,
  password,
  error,
  nickname,
  tempNickname,
  nicknameSet,
  nickError,
  isLoading,
  emailRegister,
  saveNickname,
  googleLogin,
  emailLogin,
  logout,
} = useAuth();
</script>
