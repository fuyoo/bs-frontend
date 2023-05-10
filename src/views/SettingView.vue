<script setup lang="ts">
import i18next, { t } from "i18next";
import { ref, watch } from "vue";
import { useDark, useToggle } from "@vueuse/core";
import { Sunny, Moon } from "@element-plus/icons-vue";
import { Lang } from "@/svgPath/index";
import { useAppStore } from "@/stores/app";

const lng = ref(i18next.language);
const lngs = [
  {
    name: "简体中文",
    code: "zh",
  },
  {
    name: "English",
    code: "en",
  },
];

const isDark = useDark();
const setLngFn = (data: string) => {
  i18next.changeLanguage(data).then(() => {
    location.reload();
  });
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
const splitSymbol = ref(app.splitSymbol);
watch(splitSymbol, (r) => {
  app.splitSymbol = r;
  localStorage.setItem("splitSymbol", r);
});
const enableNameSpace = ref(app.enableNameSpace);
watch(enableNameSpace, (r) => {
  app.enableNameSpace = r;
  localStorage.setItem("enableNameSpace", `${r}`);
  location.reload();
});
const keyCount = ref(app.keyCount);
watch(keyCount, (r) => {
  app.keyCount = r;
  localStorage.setItem("keyCount", `${r}`);
});
</script>

<template>
  <div class="setting">
    <div class="_setting_form">
      <el-scrollbar style="height: 100%">
        <el-form class="form" label-width="120px">
          <el-form-item :label="t('主题.标题')">
            <el-switch
              size="small"
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
                <span>{{ t("语言") }}</span>
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
          <el-form-item :label="t('键个数')">
            <el-input-number v-model="keyCount" class="w-full" />
          </el-form-item>
          <el-form-item :label="t('启用键命名空间')">
            <el-switch
              size="small"
              v-model="enableNameSpace"
              active-color="green"
            />
          </el-form-item>
          <el-form-item :label="t('命名空间分隔符')">
            <el-input
              :disabled="!enableNameSpace"
              v-model="splitSymbol"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </div>

    <div class="_app_info">
      <div class="_app_logo">
        <img src="@/assets/logo.png" width="64" height="64" />
        <div class="_app_name_version">
          <span class="_app_name">{{ t("应用名") }}</span>
          <span>{{ t("版本") }}: 2.0.0_dev</span>
        </div>
      </div>
      <p class="_app_description">
        {{ t("描述") }}
      </p>
      <pre class="_app_LICENSE" style="overflow: auto">
MIT License

Copyright (c) 2021 fuyoo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
    </pre
      >
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
    flex-shrink: 0;

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
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;
    color: $text-color-light-3;
    font-size: 14px;

    ._app_logo {
      margin-top: 20px;
      width: 80%;
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

    ._app_description,
    ._app_LICENSE {
      width: 80%;
    }
  }
}

.lang-svg {
  margin-right: 4px;
}
</style>
