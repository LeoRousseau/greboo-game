<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import nipplejs, { JoystickManager } from "nipplejs";

const joystickZone = ref<HTMLDivElement | null>(null);
let manager: JoystickManager | null = null;
const isMobile = ref(false);

const emit = defineEmits<{
  (e: "joystick-move", data: { angle: number; force: number }): void;
  (e: "joystick-end"): void;
  (e: "joystick-button-pressed"): void;
  (e: "joystick-button-released"): void;
}>();

const onJoystickButtonPressed = () => emit("joystick-button-pressed");
const onJoystickButtonReleased = () => emit("joystick-button-released");

onMounted(() => {
  isMobile.value =
    "ontouchstart" in window ||
    (navigator.maxTouchPoints !== undefined && navigator.maxTouchPoints > 0) ||
    (typeof navigator !== "undefined" &&
      /Mobi|Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent));

  if (!isMobile.value) return;

  manager = nipplejs.create({
    zone: joystickZone.value!,
    mode: "static",
    position: { left: "80px", bottom: "80px" },
    color: "white",
    size: 100,
    restOpacity: 0.5,
  });

  manager.on("move", (_, data) => {
    if (data.direction && data.angle) {
      emit("joystick-move", { angle: data.angle.radian, force: data.force });
    }
  });

  manager.on("end", () => emit("joystick-end"));
});

onUnmounted(() => {
  manager?.destroy();
});
</script>

<template>
  <div class="joystick-container">
    <div ref="joystickZone" class="joystick-zone"></div>
    <div class="jump-zone">
      <button
        v-if="isMobile"
        class="jump-btn"
        @touchstart.prevent="onJoystickButtonPressed"
        @touchend.prevent="onJoystickButtonReleased"
        @mousedown.prevent="onJoystickButtonPressed"
        @mouseup.prevent="onJoystickButtonReleased"
      ></button>
    </div>
  </div>
</template>

<style scoped>
.joystick-zone {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 200px;
  height: 200px;
  touch-action: none;
}

.jump-zone {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 200px;
  height: 200px;
  touch-action: none;
}

.jump-btn {
  position: absolute;
  display: block;
  right: 50px;
  bottom: 50px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  touch-action: none;
  z-index: 100;
}

.jump-btn:active {
  background: rgba(255, 0, 0, 0.4);
}
</style>
