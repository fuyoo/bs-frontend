<script setup lang="ts">
import {ref} from "vue";
import ConnectionDialog from "@/components/ConnectionDialog.vue";
import invoke from "@/utils/invoke";
import i18next from "i18next";
import {useTabStore} from "@/stores/tab";
import router from "@/router";
import type {TabProps} from "@/components/TabBar/type";

const tabStore = useTabStore();
let connectionDialogRef: import("vue").Ref<any> = ref(null);
let list: import("vue").Ref<any[]> = ref([]);
const fetch = () => {
  invoke("/connection/list", {})
      .then((res: any) => {
        list.value = res.data;
      });
};
fetch();
const addFn = () => {
  if (connectionDialogRef.value) {
    connectionDialogRef.value.add();
  }
};
const lng = ref(i18next.language);
const langs = [{
  key: "zh-cn",
  name: "简体中文"
}, {
  key: "en",
  name: "english"
}];
const setLngFn = (data: string) => {
  i18next.changeLanguage(data);
};
const editFn = (data: object) => {
  if (connectionDialogRef.value) {
    connectionDialogRef.value.edit(data);
  }
};
const connect = (data: TabProps) => {
  tabStore.append(data)
  router.push({
    path: "/connection/" + data.id
  });
};
</script>

<template>
  <div style="padding: 15px ">
    <el-space>
      <el-button @click="fetch" type="primary" size="small">fetch</el-button>
    </el-space>
    <el-space>
      <el-button @click="tabStore.append({id:Math.random().toString(36).slice(2),name:Math.random().toString(36).slice(2)})" type="primary" size="small">add
        tab
      </el-button>
    </el-space>
    <el-space>
      <el-button @click="addFn" type="primary" size="small">{{ $t("创建") }}</el-button>
    </el-space>
    <el-space>
      {{ $t("语言") }}
      <el-select v-model="lng" @change="setLngFn">
        <el-option v-for="item in langs" :label="item.name" :key="item.key" :value="item.key"></el-option>
      </el-select>
    </el-space>
    <ul v-for="item in list" :key="item.id">
      <li>id: {{ item.id }}</li>
      <li>name: {{ item.name }}</li>
      <li>address: {{ item.address }}</li>
      <li>username: {{ item.username }}</li>
      <li>password: {{ item.password }}</li>
      <p>
        <el-button size="small" type="primary" @click="editFn(item)">{{ $t("编辑") }}</el-button>
        <el-button size="small" type="primary" @click="connect(item)">{{ $t("连接") }}</el-button>
      </p>
    </ul>
  </div>
  <ConnectionDialog @change="fetch" ref="connectionDialogRef"/>
</template>

<style scoped lang="scss">
.card {
  width: 360px;
  margin-bottom: 20px;
}

.info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.new-connect {
  width: 64px;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  border: 1px solid var(--color-neutral-3);
  margin-bottom: 20px;
  color: var(--color-neutral-3);
  cursor: pointer;
  transition: 168ms all;
  user-select: none;

  &:hover {
    box-shadow: 0 4px 10px rgb(var(--gray-2));
  }

  &:active {
    opacity: 0.6;
  }
}
</style>
