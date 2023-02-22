<script setup lang="ts">
import TabBar from "@/components/TabBar/TabBar.vue";
import {HomeFilled} from "@element-plus/icons-vue";
</script>

<template>
  <tab-bar>
    <template #tab>
      <div class="logo">
        <img src="@/assets/logo.png" width="42" height="42"/>
      </div>
    </template>
    <template #bar>
      <el-icon>
        <HomeFilled/>
      </el-icon>&nbsp;{{ $t("主页") }}
    </template>
    <div class="view">
      <el-scrollbar>
        <keep-alive>
          <RouterView/>
        </keep-alive>
      </el-scrollbar>
    </div>
    <template #connection>
      <div class="view">
        <el-scrollbar>
          <RouterView/>
        </el-scrollbar>
      </div>
    </template>
  </tab-bar>
</template>

<style scoped lang="scss">
.logo {
  margin: 0 30px;
}

.view {
  width: 100vw;
  background: var(--el-bg-color);
  height: calc(100vh - 50px);
}
</style>