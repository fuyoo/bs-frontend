<script setup lang="ts">
import type { TabProps } from "@/components/TabBar/type";
import { Close, ArrowDown, Setting, Document } from "@element-plus/icons-vue";
import { open } from "@tauri-apps/api/shell";
import { ref } from "vue";
import type { Ref } from "vue";
import { useTabStore } from "@/stores/tab";
import router from "@/router";
import { useRoute } from "vue-router";

const route = useRoute();
const tabStore = useTabStore();

enum StaticPage {
  Home = "home",
  Setting = "setting",
}

const closeFn = (id: string) => {
  let data = tabStore.close(id);
  // focus the new tab
  if (data && data.id) {
    tabStore.focus(data.id);
  } else {
    router.replace("/home");
  }
};
const chooseFn = (id: string, noMore?: boolean) => {
  tabStore.focus(id);

  switch (id) {
    case StaticPage.Home:
      router.push("/home");
      break;
    case StaticPage.Setting:
      router.push("/setting");
      break;
    default:
      if (noMore !== true) {
        tabStore.moveToStart(id);
        moreList.value = [];
        getMoreListData();
      }
  }
};
let showMore = ref(false);
let moreList: Ref<TabProps[]> = ref([]);
let overflowStart = 0;

const calcMoreTab = () => {
  let width = 0;
  let max = 0;
  let pos = -1;
  let main = document.querySelector("div[data-db]");
  if (main) max = main.clientWidth;
  let els = document.querySelectorAll("div[data-bar]");
  for (let i = 0, length = els.length; i < length; i++) {
    width += els[i].clientWidth;
    if (width + i * 4 > max) {
      pos = i;
      break;
    }
  }
  showMore.value = pos > -1;
  if (pos > -1) {
    let res = tabStore.tabs.filter((item, index) => {
      return index >= pos;
    });
    if (res.length !== moreList.value.length) {
      overflowStart = pos;
      moreList.value = res;
    }
  }
};
const getMoreListData = () => {
  calcMoreTab();
  requestAnimationFrame(getMoreListData);
};
getMoreListData();
</script>
<template>
  <div class="tab-bar">
    <div class="tab">
      <div class="tab-l">
        <slot name="tab"></slot>
        <div
          @click="chooseFn(StaticPage.Home, true)"
          class="bar bar-default"
          :class="{ 'bar-active': route.path.includes(StaticPage.Home) }"
        >
          <slot name="bar">default</slot>
        </div>
        <div
          data-db
          class="tab-db"
          v-contextmenu="[{ label: '关闭', handler() {} }]"
        >
          <div
            data-bar
            :title="bar.name"
            @click="chooseFn(bar.id, true)"
            class="bar"
            v-for="(bar, index) in tabStore.tabs"
            :class="{ 'bar-active': bar.active }"
            :key="index"
          >
            <span>{{ bar.name }}</span>
            <el-icon class="icon-close" @click.stop="closeFn(bar.id)">
              <Close />
            </el-icon>
          </div>
          <div class="more" v-if="showMore">
            <el-popover width="200px" placement="bottom-start">
              <template #reference>
                <el-icon>
                  <arrow-down />
                </el-icon>
              </template>
              <template #default>
                <div
                  class="_drop_menu"
                  v-for="(tab, k) in moreList"
                  :id="k"
                  :title="tab.name"
                >
                  <div @click="chooseFn(tab.id)" class="_drop_name">
                    {{ tab.name }}
                  </div>
                  <el-icon class="more-close" @click.stop="closeFn(tab.id)">
                    <Close />
                  </el-icon>
                </div>
              </template>
            </el-popover>
          </div>
        </div>
      </div>
      <div class="tab-r">
        <div
          @click="
            open('https://github.com/fuyoo/bs-redis-desktop-client/issues')
          "
          class="bar bar-default"
        >
          <slot name="feedback">
            <el-icon>
              <Document /> </el-icon
            >&nbsp;{{ $t("反馈") }}
          </slot>
        </div>
        <div
          @click="chooseFn(StaticPage.Setting)"
          class="bar bar-default"
          :class="{ 'bar-active': route.path.includes(StaticPage.Setting) }"
        >
          <slot name="set">
            <el-icon>
              <Setting /> </el-icon
            >&nbsp;{{ $t("设置") }}
          </slot>
        </div>
      </div>
    </div>
    <div v-show="route.path.indexOf('/connection') === -1">
      <slot></slot>
    </div>
    <div v-show="tab.active" v-for="tab in tabStore.tabs" :key="tab.id">
      <slot name="connection"></slot>
    </div>
  </div>
</template>
<style lang="scss">
@import "@/style/common";

._drop_menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  @include bh-btn;

  &:hover {
    color: var(--el-color-primary);
  }

  ._drop_name {
    width: 160px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .more-close {
    margin-left: 8px;
    margin-right: -5px;
    padding: 2px;
    transition: 0.1s ease-in all;
    font-size: 16px;
    border-radius: 4px;

    &:hover {
      color: #fff;
      background: red;
    }
  }
}

._drop_menu + ._drop_menu {
  border-top: 1px dashed var(--el-border-color);
  padding-top: 10px;
}

._drop_menu:last-child {
  padding-bottom: 0;
}
</style>
<style scoped lang="scss">
@import "@/style/var.scss";
@import "@/style/mixin.scss";

.tab-bar {
  .tab {
    @include flex-row-between-end;
    height: $tab-bar-height;
    background: var(--bg-color-tab);
    color: var(--text-color-black);

    .tab-l {
      height: 50px;
      @include flex-row-start-end;

      .tab-db {
        height: 32px;
        margin-left: 4px;
        @include flex-row-start-end;
        padding-right: 50px;
        width: calc(100vw - 180px - 260px);
        border-radius: 4px 4px 0 0;
        overflow: hidden;
        position: relative;

        .more {
          position: absolute;
          right: -1px;
          top: 0;
          background: var(--bg-color-tab-bar);
          @include flex-row-center-center;
          box-shadow: 0 0 20px #000a;
          overflow: hidden;
          width: 32px;
          height: 32px;

          i {
            margin: 0;
            padding: 0;
            width: 32px;
            height: 32px;
            outline: none;
          }
        }
      }
    }

    .tab-r {
      height: 50px;
      width: 180px;
      @include flex-row-end-end;
      margin-right: 15px;
    }

    .bar {
      padding: 6px 8px 6px 16px;
      flex-shrink: 0;
      @include flex-row-center-center;
      background: var(--bg-color-tab-bar);
      line-height: 1;
      border-radius: 4px 4px 0 0;
      cursor: pointer;
      user-select: none;
      -webkit-user-select: none;
      transition: 0.05s ease-in-out;

      &:hover {
        opacity: 0.6;
      }

      &:active {
        opacity: 1;
      }

      &-default {
        padding: 10px 14px;
      }

      font-size: 12px;
      color: var(--bg-color-tab-bar-inactive-black);

      span {
        margin-right: 4px;
        user-select: none;
      }

      &-active {
        background: var(--bg-color-tab-bar-active);

        span {
          margin-right: 4px;
          user-select: none;
          color: var(--bg-color-tab-bar-active-text);
        }
      }

      .icon-close {
        font-weight: bold;
        cursor: pointer;
        padding: 4px;

        user-select: none;

        &:hover {
          background: #0002;
          color: #f00;
          @include border-radius;
        }
      }
    }

    .bar + .bar {
      margin-left: 4px;
    }
  }
}
</style>
