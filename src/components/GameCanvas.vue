<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { Application, Assets, Container, Sprite } from "pixi.js";

const container = ref<HTMLDivElement | null>(null);
let app: Application | null = null;

onMounted(async () => {
  app = new Application();

  // ⚡ Initialisation avec resize automatique
  await app.init({ background: '#1099bb', resizeTo: window });

  // ⚡ Append dans le container Vue, pas dans #app
  if (container.value) {
    container.value.appendChild(app.canvas);
  }

  // Container Pixi
  const pixiContainer = new Container();
  app.stage.addChild(pixiContainer);

  const texture = await Assets.load('https://pixijs.com/assets/bunny.png');

  for (let i = 0; i < 25; i++) {
    const bunny = new Sprite(texture);
    bunny.x = (i % 5) * 40;
    bunny.y = Math.floor(i / 5) * 40;
    pixiContainer.addChild(bunny);
  }

  // Centrage
  pixiContainer.x = app.screen.width / 2;
  pixiContainer.y = app.screen.height / 2;
  pixiContainer.pivot.x = pixiContainer.width / 2;
  pixiContainer.pivot.y = pixiContainer.height / 2;

  // Animation
  app.ticker.add((time) => {
    pixiContainer.rotation -= 0.01 * time.deltaTime;
  });
});

onUnmounted(() => {
  if (app) {
    app.destroy(true);
    app = null;
  }
});
</script>

<template>
  <div ref="container" class="pixi-container"></div>
</template>

<style>
.pixi-container, canvas {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  display: block;
  overflow: hidden;
}

html, body, #app {
  margin: 0;
  padding: 0;
  overflow: hidden;
  width: 100%;
  height: 100%;
}
</style>
