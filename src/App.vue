<script setup lang="ts">
import GameCanvas from "./components/GameCanvas.vue";
import MainMenu from "./components/MainMenu.vue";
import { computed } from "vue";
import { useAppStore } from "./store/appStore";

const started = computed(() => useAppStore().state === "started");
</script>

<template>
  <GameCanvas v-if="started" />
  <MainMenu v-else></MainMenu>
</template>
