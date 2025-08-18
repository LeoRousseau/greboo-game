import { defineStore } from "pinia";
import { shallowRef } from "vue";
import type { Engine } from "../game/engine/Engine";

export const useAppStore = defineStore("appStore", () => {
  const engine = shallowRef<Engine | null>(null);

  return { engine };
});
