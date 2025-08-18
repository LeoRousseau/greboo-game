import { defineStore } from "pinia";
import { ref } from "vue";
import type { Engine } from "../game/engine/Engine";

export const useAppStore = defineStore("appStore", () => {
  const engine = ref<Engine | null>(null);

  return { engine };
});
