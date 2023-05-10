<template>
  <div class="_key_contents">
    <div class="_key_trees" ref="KeyTreesRef" :style="`width:${treeWidth}px`">
      <div class="_resize_controller">
        <div class="_move_bar" ref="MoveBarRef"></div>
      </div>
      <div class="_key_search">
        <el-input
          :prefix-icon="Search"
          v-model="pattern"
          clearable
          :placeholder="t('form:匹配条件')"
          @change="searchChangeFn"
        ></el-input>
      </div>
      <el-tree-v2
        :height="treeHeight"
        :data="treeData"
        :props="{
          value: 'id',
          label: 'label',
          children: 'children',
        }"
        @node-click="treeNodeClickFn"
      />
      <div class="_tree_load_more">
        <el-button
          :icon="ArrowDownBold"
          @click="getKeysFn"
          text
          :disabled="cursorStatus.end"
          type="info"
        ></el-button>

        <el-button
          :disabled="!cursorStatus.end"
          :icon="RefreshRight"
          @click="getKeysFn(true)"
          text
          type="info"
        ></el-button>
      </div>
    </div>
    <div class="_key_detail" v-if="keyName">
      <div class="_key_detail_info">
        <div class="_key_name">
          <el-icon size="12">
            <Key />
          </el-icon>
          &nbsp;{{ keyName }}
        </div>
        <div class="_detail">
          <el-button :icon="Delete" @click="deleteKeyFn" text type="danger"
            >{{ t("删除") }}
          </el-button>
          <el-divider direction="vertical" />
          <span class="_type">{{ _key_info_detail.type }}</span>
          <el-divider direction="vertical" />
          <span class="_pttl"
            >{{ t("过期时间") }}: {{ pttlToTtl(_key_info_detail.pttl) }}</span
          >
          <el-divider direction="vertical" />
          <span class="_memory"
            >{{ t("内存") }}: {{ memoryToHuman(_key_info_detail.memory) }}</span
          >
        </div>
      </div>
      <div class="_key_types">
        <el-scrollbar style="width: 100%; height: 100%">
          <Component
            :k="keyName"
            :db="props.db"
            :is="componentName"
            :id="id"
            :type="_key_info_detail.type"
          ></Component>
        </el-scrollbar>
      </div>
    </div>
    <div class="_key_detail" v-else>
      <el-empty :description="t('请选择键')"></el-empty>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { queryKeyInfo, queryKeys } from "@/api/keys";
import { useId } from "@/utils/use";
import { computed, onMounted, reactive, ref, watch } from "vue";
import type { Ref } from "vue";
import StringType from "@/components/KeyTypes/StringType.vue";
import SetType from "@/components/KeyTypes/SetType.vue";
import { t } from "i18next";
import {
  Search,
  ArrowDownBold,
  RefreshRight,
  Delete,
  Key,
} from "@element-plus/icons-vue";
import { useAppStore } from "@/stores/app";
import type { Tree } from "@/utils/utils";
import { offAutoCorrect } from "@/utils/utils";
import UnsupportedType from "@/components/KeyTypes/UnsupportedType.vue";
import HashType from "@/components/KeyTypes/HashType.vue";
import SortedSetType from "@/components/KeyTypes/SortedSetType.vue";
import ListType from "@/components/KeyTypes/ListType.vue";
import StreamType from "@/components/KeyTypes/StreamType.vue";
import type { Action } from "element-plus";
import { ElMessageBox } from "element-plus";
import { deleteKey } from "@/api/keys";
import message from "@/utils/message";

const KeyTreesRef = ref(null) as Ref<Element | null>;
const MoveBarRef = ref(null) as Ref<Element | null>;
const treeWidth = ref(180);
onMounted(() => {
  offAutoCorrect();
  // make sure dom has been mounted.
  // here to reset the tree container width,max width is 680px
  treeWidth.value = KeyTreesRef.value?.clientWidth || 180;
  let canMove = false;
  let startWidth = KeyTreesRef.value?.clientWidth || 180;
  let startLeft = 0;
  //@ts-ignore
  MoveBarRef.value?.addEventListener("mousedown", (evt: MouseEvent) => {
    canMove = true;
    startLeft = evt.x;
    startWidth = KeyTreesRef.value?.clientWidth || 180;
    document.documentElement.setAttribute(
      "style",
      "user-select:none;-webkit-user-select:none;cursor:ew-resize"
    );
    MoveBarRef.value?.setAttribute("style", "display:block");
  });
  document.addEventListener("mousemove", (evt: MouseEvent) => {
    if (canMove) {
      let w = startWidth + (evt.x - startLeft);
      if (w >= 680) {
        w = 680;
      }
      if (w <= 180) {
        w = 180;
      }
      treeWidth.value = w;
    }
  });
  document.addEventListener("mouseup", (evt: MouseEvent) => {
    canMove = false;
    document.documentElement.removeAttribute("style");
    MoveBarRef.value?.removeAttribute("style");
  });
  console.log(MoveBarRef);
});
// define some props
let props = defineProps<{ db: number }>();
// reset all data
const resetAnyThing = () => {
  keyName.value = "";
  // reset key tree
  getKeysFn(true);
};
watch(
  () => props.db,
  () => {
    resetAnyThing();
  }
);
// get global state.
const app = useAppStore();
// get connection id
const id = useId();
// key detail
const _key_info_detail = reactive({
  type: "string",
  pttl: 0,
  memory: 0,
});
const componentName: any = computed(() => {
  switch (_key_info_detail.type) {
    case "string":
      return StringType;
    case "set":
      return SetType;
    case "hash":
      return HashType;
    case "zset":
      return SortedSetType;
    case "list":
      return ListType;
    case "stream":
      return StreamType;
    default:
      return UnsupportedType;
  }
});
let treeHeight = ref(0);
const calcTreeContainerHeight = () => {
  const calc = () => {
    let h = document.documentElement.clientHeight;
    treeHeight.value = h - 170;
  };
  // init to do calc height
  calc();
  let timer: any = -1;
  window.addEventListener("resize", () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      calc();
    }, 100);
  });
};
calcTreeContainerHeight();
// a function to get KeyInfo
const getKeyInfo = (key: string) => {
  queryKeyInfo<{ type: string; pttl: number; memory: number }>({
    id: id,
    db: props.db,
    key: key,
  }).then((res) => {
    keyName.value = key;
    _key_info_detail.type = res.data.type;
    _key_info_detail.pttl = res.data.pttl;
    _key_info_detail.memory = res.data.memory;
  });
};
// define a query key
const pattern = ref("");
// define a default redis scan cursor
let cursorStatus = {
  cursor: 0,
  end: false,
};

// define tree data
let treeData: Ref<Tree[]> = ref([]);
// generate tree data by namespace split symbol.

// get keys
const getKeysFn = (resetCursor?: boolean) => {
  // reset the cursor
  if (resetCursor === true) {
    cursorStatus.cursor = 0;
    cursorStatus.end = false;
    treeData.value = [];
  }
  if (cursorStatus.end) return;
  queryKeys<{ cursor: number; keys: string[] }>({
    id,
    db: props.db,
    cursor: cursorStatus.cursor,
    pattern: pattern.value || "*",
    count: app.keyCount,
  })
    .then((res) => {
      cursorStatus.cursor = res.data.cursor;
      cursorStatus.end = res.data.cursor === 0;
      let val: Tree[] = Object.assign([], treeData.value);
      if (app.enableNameSpace) {
          // start a web worker to parse tree data
        let work = new Worker("/worker/work.js");
        setTimeout(() => {
          message.loading();
        });
        work.postMessage(
          Object.assign(
            {},
            {
              keys: res.data.keys,
              val: JSON.stringify(treeData.value),
              splitSymbol: app.splitSymbol,
            }
          )
        );
        work.onmessage = (evt: MessageEvent<Tree[]>) => {
          message.closeLoading();
          treeData.value = evt.data;
        };
        //genTreeData(res.data.keys, val, app.splitSymbol);
      } else {
        res.data.keys.forEach((item: string) => {
          val.push({ label: item, id: item });
        });
      }
      treeData.value = val;
    })
    .catch(() => {
      message.closeLoading();
    });
};
let keyName = ref("");
const treeNodeClickFn = (
  { id }: { id: string },
  { isLeaf }: { isLeaf: boolean }
) => {
  if (isLeaf) {
    getKeyInfo(id);
  }
};
getKeysFn(true);
// transform memory used data to human read
const memoryToHuman = (val: number) => {
  const unit = (val: number, lv: number, unit: string) => {
    let s = 1;
    for (let i = 0; i < lv; i++) {
      s *= 1024;
    }
    if (val >= s) {
      return `${(val / s).toFixed(2)}${unit}`;
    } else {
      return false;
    }
  };
  // tb
  let tb = unit(val, 4, "tb");
  if (tb) return tb;
  // gb
  let gb = unit(val, 3, "gb");
  if (gb) return gb;
  // mb
  let mb = unit(val, 2, "mb");
  if (mb) return mb;
  // kb
  let kb = unit(val, 1, "kb");
  if (kb) return kb;
  // bytes
  return unit(val, 0, "b");
};
// transform expire time to seconds
const pttlToTtl = (val: number) => {
  if (val === -1) return `${t("永不过期")}`;
  return `${(val / 1000).toFixed(2)}${t("过期时间单位")}`;
};
// delete a key
const deleteKeyFn = () => {
  ElMessageBox.confirm(
    `${t("删除询问弹框.消息")}`,
    //@ts-ignore
    `${t("删除询问弹框.标题")} ${keyName.value}`,
    {
      confirmButtonText: t("确定"),
      cancelButtonText: t("取消"),
      callback: (action: Action) => {
        if (action === "confirm") {
          //todo: delete the key
          deleteKey<string>({
            db: props.db,
            id,
            key: keyName.value,
          }).then((res) => {
            message.success(res.msg);
            keyName.value = "";
          });
        }
      },
    }
  );
};
const searchChangeFn = (r: string) => {
  getKeysFn(true);
};
</script>

<style scoped lang="scss">
@import "@/style/var";
@import "@/style/mixin";

._key_contents {
  display: flex;

  ._key_trees {
    width: 180px;
    height: calc(100vh - $tab-bar-height - $action-bar-height);
    border-right: 1px solid $border-color;
    position: relative;

    ._resize_controller {
      position: absolute;
      top: 0;
      right: -3px;
      height: 100%;
      width: 3px;
      z-index: 2;
    }

    ._move_bar {
      position: absolute;
      left: -5px;
      top: 0;
      width: 9px;
      height: 100%;
      border-left: 1px dashed $border-color;
      border-right: 1px dashed $border-color;
      display: none;
      cursor: ew-resize;

      &:active {
        border-color: gray;
      }
    }

    ._resize_controller:hover ._move_bar {
      display: block;
    }

    ._key_search {
      padding: 10px;
      border-bottom: 1px solid $border-color;
    }

    ._tree_load_more {
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  ._key_detail {
    flex: 1;

    ._key_detail_info {
      height: 45px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid $border-color;
      box-sizing: border-box;

      ._key_name {
        margin-left: 15px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
      }

      ._detail {
        margin-right: 15px;
        font-size: 12px;
        color: $text-color-light-3;
        flex-shrink: 0;

        ._type {
          background: darkgreen;
          color: #fff;
          padding: 2px 8px;
          @include border-radius;
        }
      }
    }

    ._key_types {
      width: 100%;
      height: calc(100vh - $action-bar-height - $tab-bar-height - 45px);
    }
  }
}
</style>
