<template>
  <div key="app" class="home-screen d-flex flex-column overflow-hidden">
    <header
      class="app-header navbar navbar-dark px-3 flex-shrink-0 position-relative"
    >
      <button class="btn btn-outline-light btn-sm" type="button">☰</button>

      <h1 class="app-title position-absolute start-50 translate-middle-x m-0">
        MailStone
      </h1>
    </header>

    <AppMap :user="props.user" />
  </div>
</template>

<script setup>
import AppMap from "./AppMap.vue";

const props = defineProps({
  user: Object,
  nickname: String,
});

const emit = defineEmits(["logout"]);
</script>

<style scoped>
.home-screen {
  height: 100%;
  width: 100%;
}

.app-header {
  height: 56px;
  background: var(--app-brown);
  border-bottom: 1px solid var(--app-panel-border-soft);
}

.app-title {
  font-size: 1rem;
  letter-spacing: 0.12em;
}
</style>
