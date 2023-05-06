<script setup lang="ts">
import i18next from "i18next";
import { ref } from "vue";
import { useDark, useToggle } from "@vueuse/core";
import { Sunny, Moon } from "@element-plus/icons-vue";
import {Lang} from "@/svgPath/index"
const lng = ref(i18next.language);
const lngs = [
  {
    name: "简体中文",
    code: "zh-CN",
  },
  {
    name: "English",
    code: "en",
  },
];

const isDark = useDark();
const setLngFn = (data: string) => {
  i18next.changeLanguage(data);
};
const changeTheme = () => {
  useToggle(
    useDark({
      valueDark: "dark",
    })
  );
};
</script>

<template>
  <div class="setting">
    <el-form size="default" label-width="80px">
      <el-form-item :label="$t('主题.标题')">
        <el-switch
          size="default"
          v-model="isDark"
          inline-prompt
          :active-icon="Moon"
          @change="changeTheme"
          :inactive-icon="Sunny"
        />
      </el-form-item>
      <el-form-item>
        <template #label>
          <div style="display: flex; justify-content: center">
            <div class="lang-svg" v-html="Lang"></div>
            <span>{{ $t("语言") }}</span>
          </div>
        </template>
        <el-select v-model="lng" @change="setLngFn">
          <el-option
            v-for="item in lngs"
            :label="item.name"
            :key="item.code"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
.setting {
  padding: 15px;
  .el-switch {
    --el-switch-on-color: #444;
  }
}

.lang-svg {
  margin-right: 4px;
}
</style>
