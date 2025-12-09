<template>
  <div class="overlay">
    <div class="score-submit">
      <div class="celebration">
        <h1 class="win-title">YOU WIN! 🎉</h1>
      </div>
      <button class="close-btn" @click="onClose?.()">✕</button>

      <h2>Share you score !</h2>

      <p class="player-score">
        <strong>{{ score }}</strong>
      </p>

      <div class="form">
        <input v-model="name" type="text" placeholder="Ton nom" :disabled="loading" />
        <button @click="submit" :disabled="loading || !name.trim()">
          {{ loading ? "Sending..." : "Share" }}
        </button>
      </div>

      <p v-if="success" class="success">Saved ✅</p>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { addScore } from "../scoreboard";

interface Props {
  score: number;
  onClose?: () => void;
  onSubmit?: () => void;
}

const props = defineProps<Props>();
const { score, onClose, onSubmit } = props;

const name = ref("");
const loading = ref(false);
const success = ref(false);
const error = ref<string | null>(null);

async function submit() {
  if (!name.value.trim()) return;

  loading.value = true;
  error.value = null;
  success.value = false;

  try {
    await addScore(name.value.trim(), score);
    success.value = true;
    name.value = "";
    setTimeout(() => {
      onSubmit?.();
    }, 1000);
  } catch (e) {
    error.value = "Une erreur est survenue";
    console.error(e);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
/* Overlay sombre */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.score-submit {
  position: relative;
  width: 90vw;
  max-width: 400px;
  max-height: 90vh;
  padding: 2vw;
  border-radius: 12px;
  background: #3b3b3b;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  font-family: "Inter", sans-serif;
  text-align: center;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

h2 {
  margin-bottom: clamp(6px, 1vw, 12px);
  font-size: clamp(16px, 5vw, 24px);
  font-weight: 600;
  color: #ffffff;
}

/* Score affiché */
.player-score {
  margin-bottom: clamp(8px, 2vw, 12px);
  font-size: clamp(24px, 6vw, 40px);
  color: #ffea00;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
  transition: 0.2s ease;
}
.close-btn:hover {
  color: #000;
  transform: scale(1.15);
}

.form {
  display: flex;
  gap: clamp(6px, 1vw, 12px);
  justify-content: center;
  margin-bottom: clamp(10px, 1.5vw, 16px);
  flex-direction: column;
}

input {
  padding: clamp(6px, 1.5vw, 12px) clamp(8px, 1.5vw, 14px);
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: clamp(12px, 3vw, 16px);
}

button {
  padding: clamp(6px, 1.5vw, 12px) clamp(12px, 2vw, 18px);
  border-radius: 8px;
  border: none;
  background-color: #ffea00;
  color: #000000;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
  font-size: clamp(12px, 3vw, 16px);
}

button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #ffea00;
}

.success {
  color: #28a745;
  font-weight: 500;
  margin-top: 6px;
}

.error {
  color: #dc3545;
  font-weight: 500;
  margin-top: 6px;
}

/* Victory Celebration */
.celebration {
  text-align: center;
  margin-bottom: clamp(12px, 2vw, 20px);
  position: relative;
}

.win-title {
  font-size: clamp(32px, 12vw, 60px);
  font-weight: 900;
  color: #ffea00;
  text-shadow:
    0 4px 20px rgba(255, 234, 0, 0.6),
    0 0 30px rgba(255, 100, 0, 0.4);
  margin: 0 0 clamp(10px, 2vw, 20px) 0;
  letter-spacing: 2px;
  animation:
    bounce-title 0.6s ease-out,
    glow-pulse 2s ease-in-out infinite;
}

@keyframes bounce-title {
  0% {
    transform: scale(0.5) translateY(-50px);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

@keyframes glow-pulse {
  0%,
  100% {
    text-shadow:
      0 4px 20px rgba(255, 234, 0, 0.6),
      0 0 30px rgba(255, 100, 0, 0.4);
  }
  50% {
    text-shadow:
      0 4px 30px rgba(255, 234, 0, 0.8),
      0 0 50px rgba(255, 100, 0, 0.6);
  }
}
</style>
