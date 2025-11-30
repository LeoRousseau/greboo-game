<template>
  <div class="overlay">
    <div class="score-submit">
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
  width: 360px;
  padding: 20px 18px 16px;
  border-radius: 12px;
  background: #3b3b3b;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  font-family: "Inter", sans-serif;
  text-align: center;
}

h2 {
  margin-bottom: 8px;
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
}

/* Score affiché */
.player-score {
  margin-bottom: 16px;
  font-size: 32px;
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
  gap: 10px;
  justify-content: center;
  margin-bottom: 12px;
}

input {
  flex: 1;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 14px;
}

button {
  padding: 8px 14px;
  border-radius: 8px;
  border: none;
  background-color: #ffea00;
  color: #000000;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
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
</style>
