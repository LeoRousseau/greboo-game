<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useAppStore } from "../store/appStore";
import { Engine } from "../game/engine/Engine";

const container = ref<HTMLDivElement | null>(null);
const appStore = useAppStore();

onMounted(async () => {
  if (container.value) {
    appStore.engine = new Engine(container.value);
    appStore.engine.init();
  }
});

onUnmounted(() => {
  appStore.engine?.dispose();
  appStore.engine = null;
});
</script>

<template>
  <div ref="container" class="pixi-container"></div>
</template>

<style>
.pixi-container,
canvas {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  display: block;
  overflow: hidden;
}

html,
body,
#app {
  margin: 0;
  padding: 0;
  overflow: hidden;
  width: 100%;
  height: 100%;
}
</style>
