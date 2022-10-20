<script setup lang="ts">
import { lang } from "@/i18n";
import { ref, getCurrentInstance, reactive } from "vue";
import message from "@/utils/message";
const _this = getCurrentInstance();
let visible = ref(false);
const form = ref({
  host:'',
  db:'',
  username:'',
  password:''
});

const handleCancel = () => {
  //@ts-ignore
  _this.refs.form.resetFields();
};

const handleBeforeOk = (done: any) => {
  //@ts-ignore
  message.warning("error")
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
        <span :style="{ display: 'flex', alignItems: 'center', color: '#1D2129' }">
          <a-avatar :size="28" style="margin-right: 8px">
            <icon-link />
          </a-avatar>
          <a-typography-text>Username</a-typography-text>
        </span>
        <a-button type="text">{{ lang("connect") }}</a-button>
      </div>
    </a-card>
    <div class="new-connect" @click="visible = true">
      <icon-plus />
    </div>
  </a-space>

  <a-modal
    :cancel-text="lang('cancel')"
    :ok-text="lang('ok') "
    draggable
    v-model:visible="visible"
    @cancel="handleCancel"
    @before-ok="handleBeforeOk"
  >
    <template #title>
      {{lang('create') }}{{ lang('connectionDialog.title') }}
    </template>
    <a-form :model="form" ref="form" @submit="submitEvt">
      <a-form-item
        field="host"
        :label="lang('connectionDialog.formLabels.host')"
      >
        <a-input  v-model="form.host" placeholder="127.0.0.1:6379" />
      </a-form-item>
      <a-form-item field="name" :label="lang('connectionDialog.formLabels.db')">
        <a-input v-model="form.db" placeholder="1" />
      </a-form-item>
      <a-form-item field="name" :label="lang('connectionDialog.formLabels.username')">
        <a-input v-model="form.username" :placeholder="lang('connectionDialog.formLabels.username')" />
      </a-form-item>
      <a-form-item field="name" :label="lang('connectionDialog.formLabels.password')">
        <a-input v-model="form.password" :placeholder="lang('connectionDialog.formLabels.password')" />
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
