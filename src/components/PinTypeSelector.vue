<template>
  <div class="pin-type-overlay">
    <div class="type-selector-box text-center">
      <h3 class="type-selector-title">Choose Message Type</h3>

      <div class="type-options">
        <button type="button" class="type-option" @click="emit('select', 'text')">
          <i class="bi bi-chat-left-text"></i>
          <span>Text</span>
        </button>

        <button type="button" class="type-option" @click="emit('select', 'image')">
          <i class="bi bi-camera"></i>
          <span>Image</span>
        </button>

        <button type="button" class="type-option" @click="emit('select', 'voice')">
          <i class="bi bi-mic"></i>
          <span>Voice</span>
        </button>
      </div>

      <button @click="emit('cancel')" class="close-button">
        Close
      </button>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["select", "cancel"]);
</script>

<style scoped>
.pin-type-overlay {
  position: absolute;
  inset: 0;
  background: var(--app-overlay-strong);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.type-selector-box {
  width: min(90%, 460px);
  padding: 1.5rem;
  background: var(--app-dark-box);
  border: 1px solid var(--app-panel-border);
  border-radius: 6px;
}

.type-selector-title {
  margin: 0 0 1rem;
  color: var(--app-orange);
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.type-options {
  display: grid;
  gap: 0.75rem;
}

.type-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.9rem 1rem;
  color: var(--app-white);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--app-panel-border-faint);
  border-radius: 6px;
  text-align: left;
}

.type-option i {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  color: var(--app-orange);
  font-size: 1.1rem;
}

.type-option span {
  font-size: 0.95rem;
}

.type-option:hover,
.type-option:focus {
  color: var(--app-white);
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--app-panel-border);
}

.close-button {
  width: 100%;
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  color: var(--app-text);
  background: transparent;
  border: 1px solid var(--app-panel-border);
  border-radius: 6px;
}

.close-button:hover,
.close-button:focus {
  background: rgba(255, 255, 255, 0.06);
}
</style>
