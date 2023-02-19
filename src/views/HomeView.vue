<script setup lang="ts">

import {ref, getCurrentInstance} from "vue";

import message from "@/utils/message";
const _this = getCurrentInstance();
let visible = ref(false);
const form = ref({
  host: "",
  db: "",
  username: "",
  password: "",
});

message.loading()
setTimeout(()=>{
  //message.closeLoading()
},1000 *10)
</script>

<template>
  <div style="height: 1600px">
    <el-button type="primary">good job</el-button>
  </div>
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
