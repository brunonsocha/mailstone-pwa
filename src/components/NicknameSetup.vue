<template>
  <div key="setup" class="setup-nick text-center p-4">
    <h1 class="mailstone-title">Choose your name</h1>
    <p class="subtitle">How do you want to be known?</p>
    <div class="auth-box shadow mx-auto">
      <input
        v-model="nickname"
        type="text"
        class="form-control form-control-custom mb-3"
        placeholder="Enter Nickname..."
      />
      <button @click="emit('save')" class="btn btn-orange w-100">
        CONFIRM
      </button>
      <p v-if="props.error" class="error-msg mt-2">{{ props.error }}</p>
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
