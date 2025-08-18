import { defineStore } from "pinia";
import type { Application } from "pixi.js";
import { ref } from "vue";

export const useAppStore = defineStore('appStore', () => {
      const app = ref<Application | null>(null);
    
      return {app};
});