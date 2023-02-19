<script setup async lang="ts">
import {RouterView} from "vue-router";
import { i18nextPromise } from "@/i18n";
// 等待语言文件加载完成
await i18nextPromise;
</script>
<template>
  <RouterView />
</template>

<style lang="scss">

</style>
