<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useAppStore } from "../store/appStore";
import { Engine } from "../game/engine/Engine";
import { Level } from "../game/scene/Level";
import { Player } from "../game/player/player";
import { DebugController } from "../game/debug/DebugController";

const container = ref<HTMLDivElement | null>(null);
const appStore = useAppStore();

let debugController: DebugController;

const handleDebugEvents = (e: KeyboardEvent) => {
  if (e.key === "1") {
    debugController?.toggleCollision();
  }
};

onMounted(async () => {
  if (container.value) {
    appStore.engine = new Engine(container.value);
    await appStore.engine.init();

    const player = new Player();
    const level = new Level(appStore.engine.application, appStore.engine.world, player);

    appStore.engine.application.ticker.add(() => {
      level.update();
    });

    appStore.engine.start();

    setTimeout(() => {
      debugController = new DebugController(level, player, appStore.engine!);
      window.addEventListener("keyup", handleDebugEvents);
    }, 1000);
  }
});

onUnmounted(() => {
  window.removeEventListener("keyup", handleDebugEvents);
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
