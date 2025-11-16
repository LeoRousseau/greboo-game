<script setup lang="ts">
import { useAppStore } from "../store/appStore";
import logoSvg from "../assets/logo.svg";

const appStore = useAppStore();

function startGame() {
  appStore.state = "started";
}

function openScoreboard() {
  // appStore.state = "scoreboard";
}

function openCredits() {
  // appStore.state = "credits";
}
</script>

<template>
  <div class="main-menu">
    <div class="logo">
      <img :src="logoSvg" alt="GREBOO Logo" />
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
</style>
