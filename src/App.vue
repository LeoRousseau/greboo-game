<script setup lang="ts">
import GameCanvas from "./components/GameCanvas.vue";
import MainMenu from "./components/MainMenu.vue";
import LoadingScreen from "./components/LoadingScreen.vue";
import { computed, ref } from "vue";
import { useAppStore } from "./store/appStore";

const assetsLoaded = ref(false);
const started = computed(() => useAppStore().state === "started" || useAppStore().state === "won");
</script>

<template>
  <LoadingScreen v-if="!assetsLoaded" @ready="assetsLoaded = true" />
  <GameCanvas v-else-if="started" />
  <MainMenu v-else></MainMenu>
</template>
