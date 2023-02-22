<script setup lang="ts">
import type {TabProps} from "@/components/TabBar/type";
import {Close, ArrowDown, Setting, Document} from "@element-plus/icons-vue";
import {open} from '@tauri-apps/api/shell';
import {ref} from "vue";
import type {Ref} from "vue";
import {useTabStore} from "@/stores/tab";
import router from "@/router";
import {useRoute} from "vue-router";
const route = useRoute()
const tabStore = useTabStore();
const emits = defineEmits<{
  (event: 'delete'): void,
  (event: 'choose', data: TabProps | number): void
}>();
const active = ref(-1);
const closeFn = (index: number) => {
  tabStore.remove(index);
  emits('delete');
};
const chooseFn = (index: number) => {
  active.value = index;
  if (index === -1) {
    return router.push("/home");
  }
  if (index === -2) {
    return router.push("/setting");
  }
  return router.push({
    path: "/connection/" + tabStore.tabs[index].id
  });
};
let showMore = ref(false);
let moreList: Ref<TabProps[]> = ref([]);
let overflowStart = 0;
const getMoreListData = () => {
  setInterval(() => {
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
  }, 50);
};
getMoreListData();
</script>
<template>
  <div class="tab-bar">
    <div class="tab">
      <div class="tab-l">
        <slot name="tab"></slot>
        <div @click="chooseFn(-1)" class="bar bar-default" :class="{'bar-active':active === -1}">
          <slot name="bar">default</slot>
        </div>
        <div data-db class="tab-db">
          <div data-bar :title="bar.name" @click="chooseFn(index)" class="bar" v-for="(bar,index) in tabStore.tabs"
               :class="{'bar-active':active === index}"
               :key="index">
            <span>{{ bar.name }}</span>
            <el-icon class="icon-close" @click.stop="closeFn">
              <Close/>
            </el-icon>
          </div>
          <div class="more" v-show="showMore">
            <el-dropdown max-height="280" @command="chooseFn">
              <el-icon class="el-icon--right">
                <arrow-down/>
              </el-icon>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :command="k + overflowStart" :divided="k > 0" v-for="(item,k) in moreList" :id="k">
                    {{
                      item.name
                    }}---{{
                      item.id
                    }}
                    <el-icon class="more-close" @click.stop="closeFn(overflowStart + k)">
                      <Close/>
                    </el-icon>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
      <div class="tab-r">
        <div @click="open('https://github.com/fuyoo/bs-redis-desktop-client/issues')" class="bar bar-default"
             :class="{'bar-active':active === -2}">
          <slot name="feedback">
            <el-icon>
              <Document/>
            </el-icon>&nbsp;{{ $t("反馈") }}
          </slot>
        </div>
        <div @click="chooseFn(-3)" class="bar bar-default" :class="{'bar-active':active === -3}">
          <slot name="set">
            <el-icon>
              <Setting/>
            </el-icon>&nbsp;{{ $t("设置") }}
          </slot>
        </div>
      </div>
    </div>
    <div v-show="route.path.indexOf('/connection') === -1">
      <slot></slot>
    </div>
    <div v-show="k === active" v-for="(item,k) in tabStore.tabs" :key="k">
      <slot name="connection"></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/style/var.scss";
@import "@/style/mixin.scss";

.tab-bar {
  .tab {
    @include flex-row-between-end;
    height: 50px;
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
        width: calc(100vw - 180px - 240px);
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
          }

          :deep(.more-close) {
            background: red;
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