<script setup lang="ts">
import GameCanvas from "./components/GameCanvas.vue";
import MainMenu from "./components/MainMenu.vue";
import { computed } from "vue";
import { useAppStore } from "./store/appStore";

const started = computed(() => useAppStore().state === "none");
</script>

<template>
  <MainMenu v-if="started"></MainMenu>
  <GameCanvas v-else />
</template>
