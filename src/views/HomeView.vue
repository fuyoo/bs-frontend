<script setup lang="ts">
import { ref } from "vue";
import { invoke } from "@tauri-apps/api";
import message from "@/utils/message";
let list: import("vue").Ref<any[]> = ref([]);
const fetch = () => {
  message.loading();
  invoke("routes", {
    path: "/connection/list",
    payload: JSON.stringify({ a: "123" }),
  })
    .then((res: any) => {
      const data = JSON.parse(res);
      data.data.forEach((item: any) => {
        list.value.push(item);
      });
    })
    .finally(() => message.closeLoading());
};
fetch()
</script>

<template>
  <el-button @click="fetch" type="primary">fetch</el-button>
    <ul v-for="item in list" :key="item.id">
      <li>id: {{ item.id }}</li>
      <li>name: {{ item.name }}</li>
      <li>address: {{ item.address }}</li>
      <li>username: {{ item.username }}</li>
      <li>password: {{ item.password }}</li>
    </ul>
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
