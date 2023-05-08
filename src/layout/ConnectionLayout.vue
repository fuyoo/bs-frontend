<template>
  <div
    class="tab-connection-item"
    v-show="tab.active"
    v-for="tab in tabStore.tabs"
    :key="tab.id"
  >
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script lang="ts" setup>
import { useTabStore } from "@/stores/tab";

const tabStore = useTabStore();
</script>

<style scoped></style>
