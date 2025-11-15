import { defineStore } from "pinia";
import { ref, shallowRef } from "vue";
import type { Engine } from "../game/engine/Engine";
import type { InputManager } from "../game/engine/InputManager";

export const useAppStore = defineStore("appStore", () => {
  const engine = shallowRef<Engine | null>(null);
  const inputManager = shallowRef<InputManager | null>(null);
  const state = ref<"none" | "started">("none");

  return { engine, state, inputManager };
});
