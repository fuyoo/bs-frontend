<script setup async lang="ts">
import { i18nextPromise } from "@/i18n";
import { useDark, useToggle } from "@vueuse/core";
import TabBar from "@/components/TabBar/TabBar.vue";
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
  <tab-bar></tab-bar>
  <div class="view">
    <el-scrollbar>
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
.view {
  width: 100vw;
  background: var(--el-bg-color);
  height: calc(100vh - 50px);
}
</style>
