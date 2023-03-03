<template>
  <el-dialog @closed="clearFn" style="width: 380px" :close-on-click-modal="false" v-model="visible" :title="tittle"
             width="30%">
    <el-form :model="form" ref="formRef" label-width="80px">
      <el-form-item prop="name" :rules="{required:true,message:$t('validation:连接.连接名.必须')}"
                    :label="$t('form:连接.连接名')">
        <el-input autocorrect="off" :placeholder="$t('form:连接.连接名')" v-model="form.name" clearable />
      </el-form-item>
      <div v-if="!form.cluster">
        <el-form-item prop="address"
                      :rules="{required:true,message:$t('validation:连接.地址.必须')}"
                      :label="$t('form:连接.地址')">
          <el-input autocorrect="off" :placeholder="$t('form:连接.地址')" v-model="form.address" clearable />
        </el-form-item>
        <el-form-item
          prop="port"
          :rules="{required:true,message:$t('validation:连接.端口.必须')}"
          :label="$t('form:连接.端口')">
          <el-input type="number" autocorrect="off" :placeholder="$t('form:连接.端口')" v-model="form.port" clearable />
        </el-form-item>
        <el-form-item :label="$t('form:连接.用户名')">
          <el-input autocorrect="off" :placeholder="$t('form:连接.用户名')" v-model="form.username" clearable />
        </el-form-item>
        <el-form-item :label="$t('form:连接.密码')">
          <el-input autocorrect="off" :placeholder="$t('form:连接.密码')" v-model="form.password" show-password
                    clearable />
        </el-form-item>
      </div>
      <el-form-item :label="$t('form:连接.集群')">
        <el-space>
          <el-switch v-model="form.cluster"></el-switch>
        </el-space>
        <el-space>
          <el-button :icon="Plus" circle v-show="form.cluster === true" @click="form.nodes.push('')"></el-button>
        </el-space>
        <el-space>
          <el-button :icon="QuestionFilled" circle v-show="form.cluster === true" @click="uriHelpFn"></el-button>
        </el-space>
      </el-form-item>
      <div v-if="form.cluster">
        <el-form-item v-for="(node,k) in form.nodes" :prop="`form.nodes.${k}`" :rules="{
        required:true,
        message:`${$t('form:连接.节点')+(k+1)}${$t('validation:连接.集群.必须')}`
      }" :key="k" :label="$t('form:连接.节点')+(k+1)">
          <el-row style="width: 100%" :gutter="15">
            <el-col :span="20">
              <el-input v-model="form.nodes[k]" clearable
                        :placeholder="`redis uri`" />
            </el-col>
            <el-col :span="4">
              <el-button circle :icon="Delete" @click="form.nodes.splice(k,1)"></el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </div>
      <el-form-item :label="$t('form:连接.代理.SSH代理')">
        <el-switch v-model="form.proxy"></el-switch>
      </el-form-item>
      <div v-if="form.proxy">
        <el-form-item :label="$t('form:连接.代理.认证类型')">
          <el-radio-group v-model="form.proxyKeyType" class="ml-4">
            <el-radio :label="KeyType.Password">{{ $t("form:连接.代理.密码") }}</el-radio>
            <el-radio :label="KeyType.File">{{ $t("form:连接.代理.文件") }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="proxyAddress" :rules="{required:true,message:$t('validation:连接.代理地址.必须')}"
                      :label=" $t('form:连接.代理.地址')">
          <el-input :placeholder="$t('form:连接.代理.地址')" clearable v-model="form.proxyAddress" />
        </el-form-item>
        <el-form-item :label=" $t('form:连接.端口')" prop="proxyPort"
                      :rules="{required:true,message:$t('validation:连接.端口.必须')}">
          <el-input type="number" :placeholder="$t('form:连接.端口')" clearable v-model="form.proxyPort" />
        </el-form-item>

        <el-form-item :label=" $t('form:连接.代理.用户')" prop="proxyUsername"
                      :rules="{required:true,message:$t('validation:连接.代理用户.必须')}">
          <el-input :placeholder="$t('form:连接.代理.用户')" clearable v-model="form.proxyUsername" />
        </el-form-item>
        <el-form-item v-if="form.proxyKeyType === KeyType.File" :label=" $t('form:连接.代理.文件')" prop="proxyFilePath"
                      :rules="{required:true,message:$t('validation:连接.代理密钥文件.必须')}">
          <el-row :gutter="15" style="width: 100%">
            <el-col :span="20" style="white-space: nowrap;text-overflow: ellipsis;overflow: hidden">
              <el-popover placement="top-start">
                {{ form.proxyFilePath || $t("form:连接.代理.请选择文件") }}
                <template #reference>
                  {{ form.proxyFilePath || $t("form:连接.代理.请选择文件") }}
                </template>
              </el-popover>
            </el-col>
            <el-col :span="4">
              <el-button @click="chooseFilePathFn" circle :icon="DocumentAdd"></el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item v-if="form.proxyKeyType === KeyType.Password" :label=" $t('form:连接.代理.密码')"
                      prop="proxyPassword"
                      :rules="{required:true,message:$t('validation:连接.代理密码.必须')}">
          <el-input v-model="form.proxyPassword" :placeholder="$t('form:连接.代理.密码')" clearable
                    show-password></el-input>
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">{{ $t("取消") }}</el-button>
        <el-button type="primary" @click="okFn">
          {{ $t("提交") }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {nextTick, ref} from "vue";
import type {Ref} from "vue";
import {t} from "i18next";
import request from "@/utils/request";
import message from "@/utils/message";
import {Plus, Delete, DocumentAdd,QuestionFilled} from "@element-plus/icons-vue";
import {open} from "@tauri-apps/api/dialog";
import {shell} from "@tauri-apps/api";

// dialog mode define
enum Mode {
  Edit = "edit",
  Add = "add"
}

enum KeyType {
  File,
  Password
}

// is visible
const visible = ref(false);
const formRef: Ref = ref(null);
// data
let form = ref({
  name: "",
  address: "",
  port: 6379,
  username: "",
  password: "",
  cluster: false,
  nodes: [''],
  proxy: false,
  proxyKeyType: KeyType.Password,
  proxyUsername: "",
  proxyPassword: "",
  proxyFilePath: "",
  proxyPort: 6379,
  proxyAddress: ""
});
// ref mode
let mode = ref("");
// dialog tittle
const tittle = ref(`${t("创建")} ${t("连接")}`);
defineExpose({
  edit(data: any) {
    console.log(data);
    mode.value = Mode.Edit;
    visible.value = true;
    offAutoCorrect();
    tittle.value = `${t("编辑")} ${t("连接")}`;
    form.value = Object.assign(data, {nodes: data.nodes ? data.nodes.split(",") : [], proxyKeyType: KeyType.Password});
  },
  add() {
    mode.value = Mode.Add;
    tittle.value = `${t("创建")} ${t("连接")}`;
    visible.value = true;
    offAutoCorrect();
  }
});
// open choose file Path dialog with tauri-api
const chooseFilePathFn = async () => {
  let choose = await open({
    multiple: false
  });
  if (choose && typeof choose === "string") {
    form.value.proxyFilePath = choose;
    formRef.value?.clearValidate(["proxyFilePath"]);
  }
};
// clean form data
const clearFn = () => {
  if (formRef.value !== null) {
    form.value = {
      name: "",
      address: "",
      port: 6379,
      username: "",
      password: "",
      cluster: false,
      nodes: [''],
      proxy: false,
      proxyKeyType: KeyType.Password,
      proxyUsername: "",
      proxyPassword: "",
      proxyFilePath: "",
      proxyPort: 6379,
      proxyAddress: ""
    };
    // async to clear validate
    setTimeout(() => {
      formRef.value.clearValidate();
    });
  }
};
const emits = defineEmits<{
  (event: "change"): void
}>();
// submit
const okFn = () => {
  let path = "";
  if (mode.value === Mode.Add) {
    path = "/connection/add";
  }
  if (mode.value === Mode.Edit) {
    path = "/connection/edit";
  }
  formRef.value?.validate()
    .then(() => {
      console.log(form.value);
      request(path, Object.assign(form.value, {nodes: form.value.nodes.join(",")}))
        .then((res: any) => {
          message.success(res.msg);
          visible.value = false;
          emits("change");
        });
    });

};
// disable the first word uppercase
const offAutoCorrect = () => {
  nextTick(() => {
    const inputs = document.querySelectorAll("input");
    // disable the first word uppercase
    inputs.forEach((item: Element) => {
      item.setAttribute("autocorrect", "off");
    });
  });
};

const uriHelpFn = () => {
  shell.open("https://github.com/fuyoo/bs-redis-desktop-client/blob/master/uri.md")
}

</script>

<style scoped lang="scss">

</style>
