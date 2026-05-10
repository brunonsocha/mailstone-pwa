<template>
  <div key="setup" class="auth-screen text-center">
    <div class="auth-shell">
      <h1 class="auth-title">Choose your name</h1>
      <p class="auth-subtitle">How do you want to be known?</p>
      <div class="auth-box shadow mx-auto">
        <input
          v-model="nickname"
          type="text"
          class="form-control form-control-custom mb-3"
          placeholder="Enter nickname"
        />
        <button @click="emit('save')" class="btn btn-orange w-100">
          Confirm
        </button>
        <p v-if="props.error" class="error-msg mt-2">{{ props.error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const nickname = defineModel("nickname");

const props = defineProps({
  error: String,
});

const emit = defineEmits(["save"]);
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
  font-size: clamp(1.9rem, 6vw, 2.5rem);
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
}
</style>
