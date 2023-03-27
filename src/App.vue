<script setup async lang="ts">
import {RouterView} from "vue-router";
import {i18nextPromise} from "@/i18n";
import {useDark, useToggle} from "@vueuse/core";
import {invoke} from "@tauri-apps/api";
import {listen} from "@tauri-apps/api/event";
// 等待语言文件加载完成
await i18nextPromise;
useToggle(useDark());
window
  .matchMedia("(prefers-color-scheme:dark)")
  .addEventListener("change", () => {
    useToggle(useDark());
  });

// listen the backend dispatch clear event
listen("clear", () => {
  localStorage.clear();
  invoke("exit").then();
}).then();
</script>
<template>
  <RouterView />
</template>

<style lang="scss"></style>
