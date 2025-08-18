<script setup lang="ts">
import { useAppStore } from "../store/appStore";

const appStore = useAppStore();

function startGame() {
  appStore.state = "started";
}
</script>

<template>
  <div class="main-menu">
    <button v-on:click="startGame">StartGame</button>
  </div>
</template>

<style></style>
