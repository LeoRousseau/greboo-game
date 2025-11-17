<script setup lang="ts">
import { useAppStore } from "../store/appStore";
import logoSvg from "../assets/logo.svg";
import { ref, onMounted, onUnmounted } from "vue";

const appStore = useAppStore();

function startGame() {
  // pause snow when starting the game
  snowEnabled.value = false;
  appStore.state = "started";
}

function openScoreboard() {
  // appStore.state = "scoreboard";
}

function openCredits() {
  // appStore.state = "credits";
}

// generate 50 random snowflakes with CSS variable values
const snowflakes = ref(
  Array.from({ length: 50 }).map((_, i) => {
    const size = (Math.random() * 1 + 0.2).toFixed(3) + "vw"; // 0.2vw - 1.2vw
    const leftIni = (Math.random() * 20 - 10).toFixed(3) + "vw";
    const leftEnd = (Math.random() * 20 - 10).toFixed(3) + "vw";
    const left = Math.floor(Math.random() * 100) + "vw";
    const duration = 5 + Math.floor(Math.random() * 10); // 5-14s
    const delay = -(Math.random() * 10).toFixed(3) + "s";
    // subtle visual randomization
    const opacity = (0.4 + Math.random() * 0.6).toFixed(2); // 0.4 - 1.0
    const blur = (Math.random() * 1.6).toFixed(2) + "px"; // 0 - 1.6px
    return { id: i, size, leftIni, leftEnd, left, duration: duration + "s", delay, opacity, blur };
  })
);

// debug log to ensure snow array is generated
console.log("MainMenu: snowflakes generated", snowflakes.value.length);

// control whether snow runs
const snowEnabled = ref(true);
</script>

<template>
  <div class="main-menu">
    <div class="logo">
      <img :src="logoSvg" alt="GREBOO Logo" />
    </div>

    <!-- Snow background container (generated snowflakes) -->
    <div class="snow-container" :class="{ paused: !snowEnabled }" aria-hidden="true">
      <div
        v-for="s in snowflakes"
        :key="s.id"
        class="snowflake"
        :style="{
          ['--size']: s.size,
          ['--left-ini']: s.leftIni,
          ['--left-end']: s.leftEnd,
          left: s.left,
          ['--opacity']: s.opacity,
          ['--blur']: s.blur,
          animationDuration: s.duration,
          animationDelay: s.delay,
        }"
      ></div>
    </div>
    <div class="buttons-container">
      <button class="menu-btn" @click="startGame">Start</button>
      <button class="menu-btn" @click="openScoreboard">ScoreBoard</button>
      <button class="menu-btn" @click="openCredits">Credits</button>
    </div>
  </div>
</template>

<style scoped>
.main-menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  gap: 40px;
  background: linear-gradient(135deg, #272727 0%, #16101b 100%);
  margin: 0;
  padding: 20px;
  box-sizing: border-box;
}

.logo {
  width: 100%;
  max-width: 800px;
  height: auto;
  aspect-ratio: 2 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.3));
}

.buttons-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  width: 100%;
  max-width: 300px;
}

.menu-btn {
  padding: 15px 40px;
  font-size: 18px;
  font-weight: bold;
  color: #ffea00;
  background-color: rgba(8, 7, 7, 0.315);
  border: 2px solid #474c4b;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.menu-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.menu-btn:active {
  transform: scale(0.98);
}

/* Tablette / Petit écran en portrait */
@media (max-width: 768px) {
  .main-menu {
    gap: 30px;
    padding: 15px;
  }

  .logo {
    max-width: 500px;
  }

  .menu-btn {
    padding: 12px 30px;
    font-size: 16px;
  }

  .buttons-container {
    max-width: 250px;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .main-menu {
    gap: 25px;
    padding: 10px;
  }

  .logo {
    max-width: 450px;
  }

  .menu-btn {
    padding: 10px 25px;
    font-size: 14px;
  }

  .buttons-container {
    max-width: 220px;
    gap: 12px;
  }
}

/* Écran très petit en paysage (par exemple téléphone) */
@media (max-height: 600px) and (orientation: landscape) {
  .main-menu {
    gap: 15px;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }

  .logo {
    width: 50%;
    max-width: 450px;
    flex-basis: 50%;
  }

  .buttons-container {
    flex-direction: row;
    gap: 10px;
    flex-basis: 70%;
    max-width: none;
    width: auto;
  }

  .menu-btn {
    min-width: 100px;
    padding: 8px 15px;
    font-size: 12px;
  }
}

.snowflake {
  --size: 1vw;
  width: var(--size);
  height: var(--size);
  background: var(--color, #ffea00);
  border-radius: 50%;
  position: absolute;
  top: -5vh;
  /* animation params: duration/delay set inline, name/timing/count here */
  animation-name: snowfall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  opacity: var(--opacity, 1);
  filter: blur(var(--blur, 0));
}

@keyframes snowfall {
  0% {
    transform: translate3d(calc(var(--left-ini) + var(--wind, 0vw)), 0, 0);
  }
  100% {
    transform: translate3d(calc(var(--left-end) + var(--wind, 0vw)), 110vh, 0);
  }
}

/* Individual randomization is done in JS - each snowflake element gets CSS variables set inline */

/* added small blur every 6 snowflakes*/
.snowflake:nth-child(6n) {
  filter: blur(1px);
}

/* paused state (when game starts) */
.snow-container.paused .snowflake {
  animation-play-state: paused;
  opacity: 0; /* hide when paused */
}
</style>
