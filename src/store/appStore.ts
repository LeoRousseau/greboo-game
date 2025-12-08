import { defineStore } from "pinia";
import { ref, shallowRef } from "vue";
import type { Engine } from "../game/engine/Engine";
import type { InputManager } from "../game/engine/InputManager";
import type { Game } from "../game/game/Game";

export const useAppStore = defineStore("appStore", () => {
  const engine = shallowRef<Engine | null>(null);
  const game = shallowRef<Game | null>(null);
  const inputManager = shallowRef<InputManager | null>(null);
  const state = ref<"none" | "started" | "scoreboard" | "credits" | "won">("none");
  const score = ref(0);

  return { engine, state, inputManager, score, game };
});
