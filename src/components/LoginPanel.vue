<template>
  <div key="login" class="auth-screen text-center">
    <div class="auth-shell">
      <h1 class="auth-title">MailStone</h1>
      <p class="auth-subtitle">Brunon Socha 233861 & Filip Cetnarowicz 221566</p>
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
          <div class="d-flex gap-2 auth-primary-actions">
            <button
              @click="emit('standard-login')"
              class="btn btn-orange py-2 flex-grow-1"
            >
              Enter
            </button>
            <button @click="emit('register')" class="btn btn-orange py-2 flex-grow-1">
              Register
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

<style scoped>
.auth-screen {
  display: grid;
  place-items: center;
  min-height: 100%;
  padding: 24px;
}

.auth-shell {
  width: min(100%, 440px);
}

.auth-title {
  margin: 0 0 0.75rem;
  color: var(--app-orange);
  font-size: clamp(2.1rem, 6vw, 2.7rem);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.auth-subtitle {
  margin: 0 0 1.5rem;
  color: var(--app-text-muted);
  font-size: 0.95rem;
  line-height: 1.5;
}

.auth-box {
  background: var(--app-dark-box);
  padding: 1.5rem;
  border: 1px solid var(--app-panel-border);
  border-radius: 6px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.25);
}

.form-control-custom {
  min-height: 48px;
  color: var(--app-white);
  background: rgba(0, 0, 0, 0.28);
  border: 1px solid var(--app-panel-border-faint);
  border-radius: 6px;
  padding: 0.85rem 1rem;
}

.form-control-custom + .form-control-custom {
  margin-top: 0.75rem;
}

.form-control-custom::placeholder {
  color: var(--app-text-muted);
  opacity: 1;
}

.form-control-custom:focus {
  color: var(--app-white);
  background: rgba(0, 0, 0, 0.36);
  border-color: var(--app-orange);
  box-shadow: none;
}

.btn-orange {
  color: var(--app-brown);
  background: var(--app-orange);
  border: 1px solid var(--app-orange);
  font-weight: 700;
  letter-spacing: 0.04em;
}

.btn-orange:hover,
.btn-orange:focus {
  color: var(--app-brown);
  background: var(--app-yellow);
  border-color: var(--app-yellow);
}

.btn-google {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--app-white);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--app-panel-border-soft);
  font-weight: 600;
}

.btn-google:hover,
.btn-google:focus {
  color: var(--app-white);
  background: rgba(255, 255, 255, 0.12);
  border-color: var(--app-panel-border);
}

.error-msg {
  margin-bottom: 0;
  color: var(--app-yellow);
  font-size: 0.92rem;
}

@media (max-width: 720px) {
  .auth-screen {
    padding: 16px;
  }

  .auth-box {
    padding: 1.25rem;
  }

  .auth-primary-actions {
    flex-direction: column;
  }
}
</style>
