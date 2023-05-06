<template>
  <div class="_key_contents">
    <div class="_key_trees">
      <div class="_key_search">
        <el-input
          @keydown.enter="getKeysFn"
          :prefix-icon="Search"
          v-model="pattern"
          clearable
          :placeholder="$t('form:匹配条件')"
        />
      </div>
      <el-tree-v2  :indent="6" :icon="Key" :height="treeHeight" :data="data" :props="maps" />
      <div class="_tree_load_more">
        <el-button :icon="ArrowDownBold" text type="info"></el-button>
      </div>
    </div>
    <div class="_key_detail">
      <div class="_key_detail_info">
        <div class="_key_name">key name</div>
        <div class="_detail">
          <span class="_type">{{ _key_info_detail.type }}</span>
          <span class="_pttl">{{ _key_info_detail.pttl }}</span>
          <span class="_memory">{{ _key_info_detail.memory }}</span>
        </div>
      </div>
        <div class=""></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { queryKeyInfo } from "@/api/keys";
import { useId } from "@/utils/use";
import { reactive, ref, watch } from "vue";
import {Search, ArrowDownBold, Bottom, Key} from "@element-plus/icons-vue";
// define some props
let props = defineProps<{ db: number }>();
// reset all data
const resetAnyThing = () => {};
watch(
  () => props.db,
  () => {
    resetAnyThing();
  }
);
// get record id
const id = useId();
// key detail
const _key_info_detail = reactive({
  type: "string",
  pttl: 0,
  memory: 0,
});
let treeHeight = ref(0);
const calcTreeContainerHeight = () => {
  let timer:any = -1;
  const calc = () => {
    let h = document.documentElement.clientHeight;
    treeHeight.value = h - 170;
  };
  // init to do calc height
  calc();
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
    key: key || "457zbIplbY5kGxXNRUOBM",
  }).then((res) => {
    _key_info_detail.type = res.data.type;
    _key_info_detail.pttl = res.data.pttl;
    _key_info_detail.memory = res.data.memory;
  });
};
// define a query key
const pattern = ref("");
// define a default redis scan cursor
let getKeysCursor = 0;
// get keys
const getKeysFn = (isResetCursor: boolean) => {
  if (!isResetCursor) getKeysCursor = 0;
  if (pattern.value === "") {
    doGetKeys();
  } else {
    doQueryKeys();
  }
};
const doGetKeys = () => {};
const doQueryKeys = () => {};

interface Tree {
  id: string;
  label: string;
  children?: Tree[];
}

const getKey = (prefix: string, id: number) => {
  return `${prefix}-${id}`;
};
const createData = (
  maxDeep: number,
  maxChildren: number,
  minNodesNumber: number,
  deep = 1,
  key = "node"
): Tree[] => {
  let id = 0;
  return Array.from({ length: minNodesNumber })
    .fill(deep)
    .map(() => {
      const childrenNumber =
        deep === maxDeep ? 0 : Math.round(Math.random() * maxChildren);
      const nodeKey = getKey(key, ++id);
      return {
        id: nodeKey,
        label: nodeKey,
        children: childrenNumber
          ? createData(maxDeep, maxChildren, childrenNumber, deep + 1, nodeKey)
          : undefined,
      };
    });
};
const maps = {
  value: "id",
  label: "label",
  children: "children",
};
const data = createData(2, 30, 100000);
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

    ._key_search {
      padding: 10px;
      border-bottom: 1px solid $border-color;
    }
    ._tree_load_more{
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  ._key_detail {
    flex: 1;
  }
}
</style>
