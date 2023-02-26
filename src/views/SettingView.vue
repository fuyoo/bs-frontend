<script setup lang="ts">
import i18next from "i18next";
import {ref} from "vue";
const lng = ref(i18next.language);
const lngs = [
  {
    name: "简体中文",
    code: "zh-CN"
  },
  {
    name: "English",
    code: "en"
  }
];
const setLngFn = (data: string) => {
  i18next.changeLanguage(data);
};
</script>

<template>
  <div class="setting">
    <el-form size="small">
      <el-form-item :label="$t('语言')">
        <el-select v-model="lng" @change="setLngFn">
          <el-option v-for="item in lngs" :label="item.name" :key="item.code" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
.setting {
  padding: 15px;
}
</style>