<template>
  <el-dialog @closed="clearFn" style="width: 380px" :close-on-click-modal="false" v-model="visible" :title="tittle"
             width="30%" draggable>
    <el-form :model="form" ref="formRef" label-width="80px">
      <el-form-item prop="name" :rules="{required:true,message:$t('validation:连接.连接名.必须')}"
                    :label="$t('form:连接.连接名')">
        <el-input :placeholder="$t('form:连接.连接名')" v-model="form.name" clearable/>
      </el-form-item>
      <el-form-item prop="address"
                    :rules="{required:true,message:$t('validation:连接.地址.必须')}"
                    :label="$t('form:连接.地址')">
        <el-input :placeholder="$t('form:连接.地址')" v-model="form.address" clearable/>
      </el-form-item>
      <el-form-item
          prop="port"
          :rules="{required:true,message:$t('validation:连接.端口.必须')}"
          :label="$t('form:连接.端口')">
        <el-input :placeholder="$t('form:连接.端口')" v-model="form.port" clearable/>
      </el-form-item>
      <el-form-item :label="$t('form:连接.用户名')">
        <el-input :placeholder="$t('form:连接.用户名')" v-model="form.username" clearable/>
      </el-form-item>
      <el-form-item :label="$t('form:连接.密码')">
        <el-input :placeholder="$t('form:连接.密码')" v-model="form.password" show-password clearable/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">{{$t("取消")}}</el-button>
        <el-button type="primary" @click="okFn">
          {{ $t("提交") }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {computed, reactive, ref} from "vue";
import {t} from "i18next";
import invoke from "@/utils/invoke";
import message from "@/utils/message";

// dialog mode define
enum Mode {
  Edit = "edit",
  Add = "add"
}

// is visible
const visible = ref(false);
const formRef: import("vue").Ref<any> = ref(null);
// data
let form = ref({
  name: "",
  address: "",
  port: "6379",
  username: "",
  password: ""
});
// ref mode
let mode = ref(Mode.Add);
// dialog tittle
const tittle = ref(`${t("创建")} ${t("连接")}`);
defineExpose({
  edit(data: any) {
    mode.value = Mode.Edit;
    visible.value = true;
    tittle.value = `${t("编辑")} ${t("连接")}`;
    form.value = (data);
  },
  add() {
    mode.value = Mode.Add;
    tittle.value = `${t("创建")} ${t("连接")}`;
    visible.value = true;
  }
});
const clearFn = () => {
  if (formRef.value !== null) {
    form.value = {
      name: "",
      address: "",
      port: "6379",
      username: "",
      password: ""
    };
    // async to clear validate
    setTimeout(() => {
      formRef.value.clearValidate();
    });
  }
};
const okFn = () => {
  invoke("/connection/add", form.value)
      .then(res => {
        message.success(res.msg)
        console.log(res);
      });
};
</script>

<style scoped lang="scss">

</style>