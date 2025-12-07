<template>
  <div class="loading-screen">
    <div class="loading-container">
      <h1>Chargement du jeu</h1>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progress + '%' }"></div>
      </div>
      <p class="progress-text">{{ progress }}%</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { AssetPreloader } from "../game/assets/AssetPreloader";

const progress = ref(0);

const emits = defineEmits<{
  ready: [];
}>();

const preloader = new AssetPreloader();

preloader
  .preload((newProgress) => {
    progress.value = newProgress;
  })
  .then(() => {
    // Petit délai pour que l'UI se mette à jour avant d'émettre
    setTimeout(() => {
      emits("ready");
    }, 300);
  });
</script>

<style scoped>
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #2b2b2b 0%, #131313 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-container {
  text-align: center;
  color: #ffea00;
}

h1 {
  font-size: 2.5em;
  margin-bottom: 2rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.progress-bar {
  width: 300px;
  height: 10px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 1.5rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #6d0101, #ffea00);
  transition: width 0.3s ease-out;
  border-radius: 10px;
  box-shadow: 0 0 10px #ffea00;
}

.progress-text {
  font-size: 1.2em;
  margin: 0;
  font-weight: bold;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}
</style>
