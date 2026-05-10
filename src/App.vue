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

      <div v-else-if="isLoading" key="loading" class="app-loading">
        <h2 class="soapstone-title">Loading...</h2>
      </div>

      <NicknameSetup
        v-else-if="!nicknameSet"
        v-model:nickname="tempNickname"
        :error="nickError"
        @save="saveNickname"
      />

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

<style scoped>
.app-loading {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  color: var(--app-orange);
}
</style>
