<template>
  <div class="credits">
    <button class="close-btn" @click="onClose?.()">✕</button>

    <h2>🎬 Crédits</h2>

    <div class="credit-section" v-for="(s, idx) in sections" :key="idx">
      <h3>{{ s.title }}</h3>
      <ul>
        <li v-for="(item, i) in s.items" :key="i">
          <span v-if="item.link">
            <a :href="item.link" target="_blank" rel="noreferrer">{{ item.text }}</a>
          </span>
          <span v-else>{{ item.text }}</span>
        </li>
      </ul>
    </div>

    <p class="notice">Merci d'avoir joué à GREBOO's ADVENTURES : The Holy Pinecone</p>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from "vue";

type CreditItem = { text: string; link?: string };
type Section = { title: string; items: CreditItem[] };

const props = defineProps<{ onClose?: () => void }>();
const { onClose } = props;

// Sections de crédits modifiables
const sections = reactive<Section[]>([
  {
    title: "Création du jeu",
    items: [{ text: "Léo Rousseau ", link: "https://github.com/LeoRousseau/greboo-game" }],
  },
  {
    title: "Audio",
    items: [
      {
        text: "Greboo - Citron Caramel (cover)",
        link: "https://www.youtube.com/watch?v=Rhoetul-VNI&list=RDRhoetul-VNI",
      },
    ],
  },
  {
    title: "Technologies",
    items: [
      { text: "Vue 3", link: "https://vuejs.org/" },
      { text: "Pixi.js", link: "https://pixijs.com/" },
      { text: "Matter.js", link: "https://brm.io/matter-js/" },
      { text: "Supabase (scoreboard)", link: "https://supabase.com/" },
    ],
  },
]);
</script>

<style scoped>
.credits {
  width: 720px;
  max-width: 92%;
  margin: 20px auto;
  padding: 18px 22px;
  border-radius: 12px;
  background: #2f2f2f;
  color: #e6e6e6;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
  font-family: "Inter", system-ui, sans-serif;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  background: #555;
  color: #ddd;
  font-weight: 700;
  cursor: pointer;
}

h2 {
  margin-top: 6px;
  margin-bottom: 18px;
  font-size: 26px;
  color: #ffea00;
  text-align: center;
}

.credit-section {
  margin-bottom: 14px;
}

.credit-section h3 {
  margin: 8px 0;
  color: #ffd966;
  font-size: 16px;
}

ul {
  margin: 6px 0 12px 18px;
  padding: 0;
}

li {
  margin: 6px 0;
  color: #dcdcdc;
  font-size: 14px;
}

a {
  color: #a9d1ff;
  text-decoration: underline;
}

.notice {
  margin-top: 12px;
  font-size: 13px;
  color: #bdbdbd;
  text-align: center;
}

@media (max-width: 600px) {
  .credits {
    padding: 12px;
  }

  h2 {
    font-size: 20px;
  }

  li {
    font-size: 13px;
  }
}
</style>
