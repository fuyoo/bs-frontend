<script setup lang="ts">
import { useRoute } from "vue-router";
import { Key, FolderOpened, Coin } from "@element-plus/icons-vue";
import { computed, onMounted, reactive, ref } from "vue";
import { Clear, ToggleLeft, ToggleRight, UseIcon } from "@/svgPath";
import { useTranslation } from "i18next-vue";
import KeyContents from "@/components/KeyContents.vue";
import { queryDatabaseInfo } from "@/api/database";
import { useId } from "@/utils/use";

const id = useId();
const { t } = useTranslation();
const route = useRoute();
let isCollapse = ref(false);
let db = ref(1);
let dbInfo = reactive({
  database: 16,
  keys: 0,
  memory: ["0", "0", ":"],
});
const chooseDb = (i: number) => {
  db.value = i;
  getDatabaseInfo();
};
const getDatabaseInfo = () => {
  queryDatabaseInfo<{
    database: string; keys: number; memory: string;
  }>({
    id,
    db: db.value - 1,
    key: "hW85ciwMV8_bCtIe_e9Xs",
  }).then((res) => {
    dbInfo.database = Number(res.data.database);
    dbInfo.keys = res.data.keys;
    dbInfo.memory = res.data.memory.split("\r\n");
  });
};

onMounted(() => {
  if (!route.params.id) return;
  getDatabaseInfo();
});
const useDb = computed(() => t(`contextmenu:使用`));
let cleanUp = computed(() => t("contextmenu:清空"));
const contextmenu = [
  {
    label: cleanUp,
    handler(args: any) {
      console.log(`at here`, args);
    },
    icon: Clear,
  },
  {
    label: useDb,
    handler(db: number) {
      chooseDb(db);
    },
    icon: UseIcon,
  },
];
</script>

<template>
  <div class="_connection_view">
    <el-scrollbar class="menu">
      <h5></h5>
      <div
        :title="$t('数据库') + '.' + (i - 1)"
        v-contextmenu:[i]="contextmenu"
        @click="chooseDb(i)"
        :class="{
          _el_menu_active: db === i,
        }"
        class="_el_menu"
        v-for="i in dbInfo.database"
        :key="i"
      >
        <el-icon>
          <Coin />
        </el-icon>
        <span
          class="_database_index"
          style="margin-left: 5px"
          v-show="isCollapse === false"
        >
          {{ $t("数据库") + "." + (i - 1) }}
        </span>
      </div>
      <h5></h5>
    </el-scrollbar>
    <div class="_ctx">
      <div class="_action_bar">
        <div
          class="toggle-menu"
          @click="isCollapse = true"
          v-if="!isCollapse"
          v-html="ToggleLeft"
        ></div>
        <div
          class="toggle-menu"
          v-html="ToggleRight"
          @click="isCollapse = false"
          v-else
        ></div>
        <div class="_action_bar_info">
          <div class="_action_bar_info_item _action_bar_info_database">
            <el-icon>
              <Coin />
            </el-icon>
            <span>{{ $t("数据库") + "." + (db - 1) }}</span>
          </div>
          <div class="_action_bar_info_item _action_bar_info_keys">
            <el-icon>
              <Key />
            </el-icon>
            <span>{{ $t("键") }} : {{ dbInfo.keys }}</span>
          </div>
          <div class="_action_bar_info_item _action_bar_info_size">
            <el-icon>
              <FolderOpened />
            </el-icon>
            <span>{{ $t("内存") }}: {{ dbInfo.memory[2].split(":")[1] }}</span>
          </div>
        </div>
      </div>
      <el-scrollbar class="_scroller_ctx">
        <KeyContents :db="db - 1"></KeyContents>
      </el-scrollbar>
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
    background: $bg-framework;
    border-right: 1px solid $border-color;
    box-sizing: border-box;

    ._el_menu {
      border-right: none;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 6px 10px;
      margin: 5px 8px;
      @include border-radius;
      color: $text-color-light-3;
      cursor: pointer;
      transition: 0.3s ease-in-out all;
      -webkit-user-select: none;
      user-select: none;

      &:hover {
        background: var(--el-color-success-dark-2);
        color: #fff;
      }

      ._database_index {
        font-size: 12px;
      }
    }

    ._el_menu_active {
      background: var(--el-color-success-dark-2);
      color: #fff;
    }
  }

  ._ctx {
    flex: 1;

    ._action_bar {
      height: $action-bar-height;
      background: var(--el-menu-bg-color);
      border-bottom: 1px solid $border-color;
      box-sizing: border-box;
      color: $text-color-light-1;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .toggle-menu {
        width: 20px;
        height: 20px;
        color: $text-color-light-3;
        @include bh-btn;
        margin-left: 8px;
      }

      ._action_bar_info {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding-right: 15px;

        ._action_bar_info_item {
          display: flex;
          align-items: center;
          font-size: 12px;

          span {
            margin-left: 4px;
            color: $text-color-light-3;
          }
        }

        ._action_bar_info_item + ._action_bar_info_item {
          margin-left: 8px;
        }
      }
    }

    ._scroller_ctx {
      height: calc(100vh - $tab-bar-height - $action-bar-height);
      background: $content-background;
    }
  }
}
</style>
