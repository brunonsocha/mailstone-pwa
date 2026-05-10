<template>
  <div key="login" class="login-wrapper text-center">
    <h1 class="app-title">MailStone</h1>
    <p class="subtitle">Brunon Socha 233861 & Filip Cetnarowicz 221566</p>
    <div class="auth-box shadow">
      <div class="mb-4">
        <input
          v-model="email"
          type="email"
          class="form-control form-control-custom"
          placeholder="Email"
        />
        <input
          v-model="password"
          type="password"
          class="form-control form-control-custom"
          placeholder="Password"
        />
      </div>
      <div class="d-grid gap-2">
        <div class="d-flex gap-2">
          <button
            @click="emit('standard-login')"
            class="btn btn-orange py-2 flex-grow-1"
          >
            ENTER
          </button>
          <button
            @click="emit('register')"
            class="btn btn-orange py-2 flex-grow-1"
          >
            REGISTER
          </button>
        </div>

        <button @click="emit('google-login')" class="btn btn-google py-2">
          <img
            src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png"
            width="18"
            class="me-2"
          />
          Sign in with Google
        </button>
      </div>
      <p v-if="props.error" class="error-msg mt-3">{{ props.error }}</p>
    </div>
  </div>
</template>

<script setup>
const email = defineModel("email");
const password = defineModel("password");

const props = defineProps({
  error: String,
});

const emit = defineEmits(["standard-login", "register", "google-login"]);
</script>
