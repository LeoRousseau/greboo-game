<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useAppStore } from "../store/appStore";
import { Engine } from "../game/engine/Engine";
import { DebugController } from "../game/debug/DebugController";
import { Game } from "../game/game/Game";
import VirtualJoystick from "./VirtualJoystick.vue";
import fullscreenIcon from "../assets/fullscreen_icon.svg";
import { InputManager } from "../game/engine/InputManager";
import ScoreSubmit from "./ScoreSubmit.vue";
import { computeScore } from "../scoreboard/computeScore";

const container = ref<HTMLDivElement | null>(null);
const isPseudoFullscreen = ref(false);
const appStore = useAppStore();

let debugController: DebugController;

const handleDebugEvents = (e: KeyboardEvent) => {
  if (e.key === "1") {
    debugController?.toggleCollision();
  } else if (e.key === "2") {
    debugController.togglePhysicsCollision();
  } else if (e.key === "3") {
    appStore.game?.win();
  }
};

const toggleFullscreen = async () => {
  const doc: any = document;

  const exitFn = () => {
    if (document.exitFullscreen) return document.exitFullscreen();
    if (doc.webkitExitFullscreen) return doc.webkitExitFullscreen();
    // nothing else to do for pseudo fullscreen
    return Promise.resolve();
  };

  const requestOnElement = async (el: Element) => {
    const anyEl: any = el;
    if (anyEl.requestFullscreen) return anyEl.requestFullscreen();
    if (anyEl.webkitRequestFullscreen) return anyEl.webkitRequestFullscreen();
    return Promise.reject(new Error("Fullscreen API not supported on this element"));
  };

  // If a native fullscreen is active, try to exit it
  if (doc.fullscreenElement || doc.webkitFullscreenElement) {
    await exitFn();
    isPseudoFullscreen.value = false;
    return;
  }

  // Try to request native fullscreen on the container (or documentElement)
  const el = container.value ?? document.documentElement;
  try {
    await requestOnElement(el);
    // native fullscreen succeeded
    isPseudoFullscreen.value = false;
  } catch (e) {
    // Fallback for browsers that don't support Fullscreen API (notably older iOS Safari)
    isPseudoFullscreen.value = !isPseudoFullscreen.value;
    // Try to hide the address bar on mobile by scrolling to top
    try {
      window.scrollTo(0, 0);
    } catch (_) {}
  }
};

function backToMenu() {
  appStore.state = "none";
}

// Exemple de callback joystick
const onJoystickMove = ({ angle, force }: { angle: number; force: number }) => {
  if (force < 0.2) return;

  const direction = angle > Math.PI / 2 && angle < (3 * Math.PI) / 2 ? "left" : "right";
  if (appStore.inputManager && appStore.inputManager.joystickState !== direction) {
    appStore.inputManager.joystickState = direction;
  }
};

const onJoystickEnd = () => {
  if (appStore.inputManager) {
    appStore.inputManager.joystickState = "neutral";
  }
};

const onJoystickPressed = () => {
  if (appStore.inputManager) {
    appStore.inputManager.joystickButtonPressed = true;
  }
};

const onJoystickReleased = () => {
  if (appStore.inputManager) {
    appStore.inputManager.joystickButtonPressed = false;
  }
};

onMounted(async () => {
  if (container.value) {
    appStore.inputManager = new InputManager();
    const engine = new Engine(container.value, appStore.inputManager);
    await engine.init();
    appStore.engine = engine;

    const game = new Game(
      engine,
      () => (appStore.state = "none"),
      () => {
        appStore.score = computeScore(game.scoreboard.elapsedTime, game.player.inventory.pinecone ?? 0, game.player.hp);
        appStore.state = "won";
      }
    );
    game.start();
    appStore.game = game;

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
  <div ref="container" :class="['pixi-container', { 'pseudo-fullscreen': isPseudoFullscreen }]">
    <ScoreSubmit
      v-if="appStore.state === 'won'"
      :score="appStore.score"
      :onClose="backToMenu"
      :onSubmit="backToMenu"
    ></ScoreSubmit>
    <VirtualJoystick
      v-if="appStore.engine"
      @joystick-move="onJoystickMove"
      @joystick-end="onJoystickEnd"
      @joystick-button-pressed="onJoystickPressed"
      @joystick-button-released="onJoystickReleased"
    />
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

.pseudo-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background: black;
}
</style>
