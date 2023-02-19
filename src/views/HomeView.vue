<script setup lang="ts">

import { ref, getCurrentInstance } from "vue";


import message from "@/utils/message";
const _this = getCurrentInstance();
let visible = ref(false);
const form = ref({
  host: "",
  db: "",
  username: "",
  password: "",
});

const handleCancel = () => {
  //@ts-ignore
  _this.refs.form.resetFields();
};

const handleBeforeOk = (done: any) => {
  //@ts-ignore
  message.warning("error");
  done(false);
};
const submitEvt = (res: any) => {
  console.log(res);
};
</script>

<template>
  <a-space wrap style="padding: 25px">
    <a-card class="card" hoverable>
      <div class="info">
        <span
          :style="{ display: 'flex', alignItems: 'center', color: '#1D2129' }"
        >
          <a-avatar :size="28" style="margin-right: 8px">
            <icon-link />
          </a-avatar>
          <a-typography-text>Username</a-typography-text>
        </span>
        <a-button type="text">{{ $t("连接") }}</a-button>
      </div>
    </a-card>
    <div class="new-connect" @click="visible = true">
      <icon-plus />
    </div>
  </a-space>

  <a-modal
    :cancel-text="$t('取消').toString()"
    :ok-text="$t('确定').toString()"
    draggable
    v-model:visible="visible"
    @cancel="handleCancel"
    @before-ok="handleBeforeOk"
  >

    <template #title> {{ $t("创建") }}{{ $t("连接弹窗.标题") }} </template>
    <a-form :model="form" ref="form" @submit="submitEvt">
      <a-form-item field="host" :label="$t('连接弹窗.地址').toString()">
        <a-input v-model="form.host" placeholder="127.0.0.1:6379" />
      </a-form-item>
      <a-form-item field="name" :label="$t('连接弹窗.数据库').toString()">
        <a-input v-model="form.db" placeholder="1" />
      </a-form-item>
      <a-form-item field="name" :label="$t('连接弹窗.用户名').toString()">
        <a-input
          v-model="form.username"
          :placeholder="$t('连接弹窗.用户名').toString()"
        />
      </a-form-item>
      <a-form-item field="name" :label="$t('连接弹窗.密码').toString()">
        <a-input
          v-model="form.password"
          :placeholder="$t('连接弹窗.密码').toString()"
        />
      </a-form-item>
    </a-form>
  </a-modal>
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
