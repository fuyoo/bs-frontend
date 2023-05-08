<script setup lang="ts">
import i18next from "i18next";
import { ref, watch } from "vue";
import { useDark, useToggle } from "@vueuse/core";
import { Sunny, Moon } from "@element-plus/icons-vue";
import { Lang } from "@/svgPath/index";
import { useAppStore } from "@/stores/app";

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
let app = useAppStore();
// namespace split symbol
const splitSymbol = ref(localStorage.getItem("splitSymbol") || ":");
watch(splitSymbol, (r) => {
  app.splitSymbol = r;
  localStorage.setItem("splitSymbol", r);
  console.log(r);
});
</script>

<template>
  <div class="setting">
    <div class="_setting_form">
      <el-scrollbar style="height: 100%">
        <el-form class="form" size="default" label-width="120px">
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
            <el-select class="w-full" v-model="lng" @change="setLngFn">
              <el-option
                v-for="item in lngs"
                :label="item.name"
                :key="item.code"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('命名空间分隔符')">
            <el-input v-model="splitSymbol"></el-input>
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </div>

    <div class="_app_info">
      <div class="_app_logo">
        <img src="@/assets/logo.png" width="64" height="64" />
        <div class="_app_name_version">
          <span class="_app_name">{{ $t("应用名") }}</span>
          <span>{{ $t("版本") }}: 2.0.0_dev</span>
        </div>
      </div>
      <p class="_app_description">
        BS RDC
        由Rust和Tauri编写，使用虚拟列表渲染Key,支持万+key渲染，Set,Hash数据类型使用scan，List数据类型使用LRANGE渲染支持分页查询
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/style/var";

.w-full {
  width: 100%;
}

.setting {
  display: flex;

  ._setting_form {
    width: 480px;
    height: calc(100vh - $tab-bar-height);

    .form {
      margin: 20px;
    }

    .el-switch {
      --el-switch-on-color: #444;
    }
  }

  ._app_info {
    flex: 1;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    color: $text-color-light-3;
    margin-top: -20%;
    font-size: 14px;
    ._app_logo {
      width: 50%;
      display: flex;
      align-items: center;
      ._app_name_version {
        display: flex;
        height: 70%;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        padding: 0 10px;
        ._app_name {
          font-size: 18px;
        }
      }
    }
    ._app_description {
      width: 50%;
    }
  }
}

.lang-svg {
  margin-right: 4px;
}
</style>