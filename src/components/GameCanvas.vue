<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useAppStore } from "../store/appStore";
import { Engine } from "../game/engine/Engine";
import { DebugController } from "../game/debug/DebugController";
import { Game } from "../game/game/Game";
import fullscreenIcon from "../assets/fullscreen_icon.svg";

const container = ref<HTMLDivElement | null>(null);
const appStore = useAppStore();

let debugController: DebugController;

const handleDebugEvents = (e: KeyboardEvent) => {
  if (e.key === "1") {
    debugController?.toggleCollision();
  } else if (e.key === "2") {
    debugController.togglePhysicsCollision();
  }
};

const toggleFullscreen = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.documentElement.requestFullscreen();
  }
};

onMounted(async () => {
  if (container.value) {
    const engine = new Engine(container.value);
    await engine.init?.(); // si tu utilises init
    appStore.engine = engine;

    const game = new Game(engine);
    game.start();

    setTimeout(() => {
      debugController = new DebugController(game);
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
  <div ref="container" class="pixi-container">
    <div class="bottom-right-menu">
      <div class="buttton" @click="toggleFullscreen">
        <img :src="fullscreenIcon" alt="Fullscreen" />
      </div>
    </div>
  </div>
</template>

<style>
.pixi-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.bottom-right-menu {
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: flex;
  gap: 8px;
}

.bottom-right-menu .buttton {
  padding: 6px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.bottom-right-menu img {
  width: 24px; /* ou 60-70% de la taille du bouton */
  height: 24px;
  display: block; /* éviter le petit espace inline */
}

.bottom-right-menu button:hover {
  background-color: rgba(0, 0, 0, 0.8);
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
