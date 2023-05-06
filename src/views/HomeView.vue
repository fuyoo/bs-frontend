<script setup lang="ts">
import { ref } from "vue";
import type { Ref } from "vue";
import ConnectionDialog from "@/components/ConnectionDialog.vue";
import request from "@/utils/request";
import { useTabStore } from "@/stores/tab";
import router from "@/router";
import type { TabProps } from "@/components/TabBar/type";
import {
  Plus,
  Refrigerator,
  Delete,
  EditPen,
  SwitchButton,
} from "@element-plus/icons-vue";
import { isAvailable } from "@/api/database";

const tabStore = useTabStore();
let connectionDialogRef: Ref = ref(null);
let list: Ref<any[]> = ref([]);
const fetch = () => {
  request("/connection/list", {}).then((res: any) => {
    list.value = res.data;
  });
};
fetch();
const recordIsAvailable = (data: any) => {
  return isAvailable(data);
};
const addFn = () => {
  if (connectionDialogRef.value) {
    connectionDialogRef.value.add();
  }
};
const editFn = (data: TabProps) => {
  if (connectionDialogRef.value) {
    connectionDialogRef.value.edit({ ...data });
  }
};
const connect = async (data: TabProps) => {
  await recordIsAvailable(data);
  tabStore.append(data);
  await router.push({
    path: "/connection/" + data.id,
  });
};
const deleteFn = (data: TabProps) => {
  tabStore.close(data.id);
  request("/connection/delete", { id: data.id })
    .then((res: any) => {
      console.log(res);
    })
    .finally(() => {
      fetch();
    });
};
</script>

<template>
  <div class="_db">
    <div class="_db_i _db_add" @click="addFn">
      <el-icon size="80">
        <Plus />
      </el-icon>
      <div class="_db_info">
        <el-icon size="16">
          <Plus /> </el-icon
        >&nbsp;{{ $t("创建") }}
      </div>
    </div>
    <div class="_db_i" v-for="item in list" :key="item.id">
      <div class="_db_i_inner">
        <el-icon size="35">
          <Refrigerator />
        </el-icon>
        <p>{{ item.name }}</p>
      </div>
      <div class="_db_info">
        <p class="_db_info_name">{{ item.name }}</p>
        <p class="_db_info_act">
          <el-button
            circle
            :icon="SwitchButton"
            type="success"
            @click="connect(item)"
          ></el-button>
          <el-button
            circle
            :icon="EditPen"
            @click="editFn(item)"
            type="warning"
          ></el-button>
          <el-button
            circle
            :icon="Delete"
            @click="deleteFn(item)"
            type="danger"
          ></el-button>
        </p>
      </div>
    </div>
  </div>
  <ConnectionDialog @change="fetch" ref="connectionDialogRef" />
</template>

<style scoped lang="scss">
@import "@/style/mixin.scss";

._db {
  margin-left: -25px;
  @include flex-row-start-start;
  flex-wrap: wrap;
  padding: 25px;

  ._db_i {
    width: 160px;
    height: calc(160px / 0.818);
    background: #0001;
    margin-left: 25px;
    margin-bottom: 25px;
    @include border-radius;
    @include border;
    @include flex-row-center-center;
    cursor: pointer;
    overflow: hidden;
    position: relative;

    ._db_i_inner {
      margin: 15px;
      @include flex-column-center-center;

      p {
        width: 100%;
        word-break: break-all;
        text-align: center;
      }
    }

    ._db_info {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      @include flex-column-center-center;
      @include border-radius;
      transition: 0.168s;
      transform: translate3d(0, 110%, 0);
      background: var(--el-bg-color);

      p {
        padding: 0;
        margin: 0;
      }

      ._db_info_name {
        padding: 20px;
        word-break: break-all;
        text-align: center;
      }

      ._db_info_act {
        text-align: center;
        align-items: center;
      }
    }

    &:hover ._db_info {
      transform: translate3d(0, 0, 0);
    }
  }

  &_add {
    @include flex-row-center-center;
    color: var(--text-color-black);

    &:hover {
      color: var(--text-color-black-hover);
    }
  }
}
</style>
