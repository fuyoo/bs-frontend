<script setup async lang="ts">
import { RouterView } from "vue-router";
import { i18nextPromise } from "@/i18n";
import { useDark, useToggle } from "@vueuse/core";
// 等待语言文件加载完成
await i18nextPromise;
useToggle(useDark());
window
  .matchMedia("(prefers-color-scheme:dark)")
  .addEventListener("change", () => {
    useToggle(useDark());
  });
</script>
<template>
  <RouterView />
</template>

<style lang="scss"></style>
