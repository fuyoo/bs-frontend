<script setup lang="ts">
import { useRoute } from "vue-router";
import { Cpu } from "@element-plus/icons-vue";
import { ref } from "vue";

const route = useRoute();
let isCollapse = ref(true);
let db = ref(1);
</script>

<template>
  <div class="_connection_view">
    <el-scrollbar class="menu">
      <h5>数据库</h5>
      <div
        :class="{
          _el_menu_active: db === i,
        }"
        class="_el_menu"
        v-for="i in 16"
        :key="i"
      >
        <el-icon>
          <Cpu />
        </el-icon>
        <span v-show="isCollapse === false">
          {{ $t("数据库") + (i - 1) }}
        </span>
      </div>
    </el-scrollbar>
    <div class="_ctx">
      <div class="_action_bar">
        <el-switch v-model="isCollapse"></el-switch>
      </div>
      <el-scrollbar class="_scroller_ctx"></el-scrollbar>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/style/var";
@import "@/style/mixin";

._connection_view {
  height: calc(100vh - $tab-bar-height);
  display: flex;

  .menu {
    height: 100%;
    width: max-content;
    padding: 0 10px;

    ._el_menu {
      border-right: none;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    ._el_menu_active {
      color: var(--el-color-primary);
    }

    @include shadow;
  }

  ._ctx {
    flex: 1;

    ._action_bar {
      height: $action-bar-height;
      background: var(--el-menu-bg-color);
    }

    ._scroller_ctx {
      height: calc(100vh - $tab-bar-height - $action-bar-height);
      background: green;
    }
  }
}
</style>
