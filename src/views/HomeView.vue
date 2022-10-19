<script setup lang="ts">
import { ref } from "vue";
let visible = ref(false);
const handleCancel = () =>{

}

const handleBeforeOk = () => {

}
const form = ref({})
</script>

<template>
  <a-space wrap style="padding: 25px">
    <a-card class="card" hoverable>
      <div class="info">
        <span class="" :style="{ display: 'flex', alignItems: 'center', color: '#1D2129' }">
          <a-avatar :size="28" style="margin-right: 8px">
            <icon-link />
          </a-avatar>
          <a-typography-text>Username</a-typography-text>
        </span>
        <a-button type="text">{{ $lang("connect") }}</a-button>
      </div>
    </a-card>
    <div class="new-connect" @click="visible = true">
      <icon-plus />
    </div>
  </a-space>

  <a-modal draggable v-model:visible="visible" title="Modal Form" @cancel="handleCancel" @before-ok="handleBeforeOk">
    <a-form :model="form">
      <a-form-item field="name" label="Name">
        <a-input v-model="form.name" />
      </a-form-item>
      <a-form-item field="post" label="Post">
        <a-select v-model="form.post">
          <a-option value="post1">Post1</a-option>
          <a-option value="post2">Post2</a-option>
          <a-option value="post3">Post3</a-option>
          <a-option value="post4">Post4</a-option>
        </a-select>
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
