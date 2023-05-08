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
      <el-tree-v2
        :indent="6"
        :icon="Key"
        :height="treeHeight"
        :data="treeData"
        :props="maps"
      />
      <div class="_tree_load_more">
        <el-button
          :icon="ArrowDownBold"
          @click="getKeysFn"
          text
          type="info"
        ></el-button>
      </div>
    </div>
    <div class="_key_detail">
      <div class="_key_detail_info">
        <div class="_key_name">key name</div>
        <div class="_detail">
          <span class="_type"
            >{{ $t("键类型") }}: {{ _key_info_detail.type }}</span
          >
          <el-divider direction="vertical" />
          <span class="_pttl"
            >{{ $t("过期时间") }}: {{ _key_info_detail.pttl }}</span
          >
          <el-divider direction="vertical" />
          <span class="_memory"
            >{{ $t("占用内存") }}: {{ _key_info_detail.memory }}</span
          >
        </div>
      </div>
      <div class=""></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { queryKeyInfo, queryKeys } from "@/api/keys";
import { useId } from "@/utils/use";
import {reactive, Ref, ref, watch} from "vue";
import { Search, ArrowDownBold, Bottom, Key } from "@element-plus/icons-vue";
import { useAppStore } from "@/stores/app";
import type {Response} from "@/utils/request";
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
let treeHeight = ref(0);
const calcTreeContainerHeight = () => {
  let timer: any = -1;
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

let treeData: Ref<Tree[]> = ref([]);

// generate tree data by namespace split symbol.
const genTreeData = (keys: string[], tree: Tree[]) => {
    const parseNamespace = (
        step: number,
        deep: number,
        val: string[],
        parent: Tree
    ) => {
        // check is full
        if (step > deep - 1) {
            return;
        }
        // 如果没有children
        if (!parent.children || parent.children.length === 0) {
            // 手动增加一个
            parent.children = [];
        }
        // check is the last children
        if (step === deep - 1) {
            parent.children.push({
                label: val[step],
                id: val.join(":"),
            });
            return;
        }

        // 查找是否有label存在
        let exists = false;
        for (let item in parent.children) {
            if (parent.children[item].label === val[step]) {
                exists = true;
                parseNamespace(step + 1, deep, val, parent.children[item]);
            }
        }
        if (!exists) {
            let item = {
                label: val[step],
                id: val[step],
            };
            parent.children.push(item);
            parseNamespace(step + 1, deep, val, item);
        }
    };
    keys.forEach((data) => {
        // 拆分数据
        let sp: string[];
        try {
            sp = data.split(app.splitSymbol);
        } catch (e) {
            sp = [data];
        }
        // 查找是否有第一个命名空间
        let index = -1;
        for (let item in tree) {
            if (tree[item].label === sp[0]) {
                index = Number(item);
                break;
            }
        }
        // 如果第一个不纯在
        if (index === -1) {
            let val = {
                id: sp[0],
                label: sp[0],
            };
            tree.push(val);
            parseNamespace(1, sp.length, sp, val);
        } else {
            parseNamespace(1, sp.length, sp, tree[index]);
        }
    });
};
const doGetKeys = () => {
  queryKeys<{cursor:number,keys:string[]}>({
    id,
    db: props.db,
    cursor: 0,
    pattern: "*",
    count: 200,
  }).then((res) => {
    let val:Tree[] = []
    genTreeData(res.data.keys,val)
      treeData.value = val
      console.log(treeData)
  });
};
const doQueryKeys = () => {};

interface Tree {
  id: string;
  label: string;
  children?: Tree[];
}

const maps = {
  value: "id",
  label: "label",
  children: "children",
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
      }

      ._detail {
        margin-right: 15px;
        font-size: 12px;
        color: $text-color-light-3;
      }
    }
  }
}
</style>
