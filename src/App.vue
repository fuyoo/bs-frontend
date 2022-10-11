<script setup lang="ts">
import {RouterLink, RouterView} from 'vue-router'
import {appWindow} from '@tauri-apps/api/window'
import {appStore} from "@/stores/app"
import {onMounted} from "vue";

const store = appStore()
onMounted(() => {
  store.init()
})
const themeChange = (value: string) => {
  console.log(value)
  if (value === 'light') {
    store.light()
  } else {
    store.dark()
  }
}

</script>

<template>
  <div class="action">
    <a-dropdown position="br">
      <div class="act-btn">
        <icon-settings/>
      </div>
      <template #content>
        <a-doption>
          <template #icon>
            <icon-location/>
          </template>
          <div @click.stop style="width: 100px">
            <a-switch :default-checked="store.theme == 'dark'" checked-value="dark"
                      unchecked-value="light" @change="themeChange">
              <template #checked>
                dark
              </template>
              <template #unchecked>
                light
              </template>
            </a-switch>
          </div>

        </a-doption>
      </template>
    </a-dropdown>
    <div class="act-btn" @click="appWindow.minimize()">
      <icon-minus/>
    </div>
    <div class="act-btn" @click="appWindow.toggleMaximize()">
      <icon-fullscreen/>
    </div>
    <div class="act-btn act-btn-close" @click="appWindow.close()">
      <icon-close/>
    </div>
  </div>
  <div>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </div>

  <RouterView/>
</template>

<style>
html, body {
  background: var(--color-bg-2);
  color: var(--color-text-1);
}

body {
  --bg-highlight: #0001;
}

body[arco-theme='dark'] {
  --bg-highlight: var(--color-bg-4)
}

a {
  color: var(--color-link-light-4);
}

a:hover {
  color: var(--color-link-light-3);
}
</style>

<style scoped lang="scss">
.action {
  position: absolute;
  right: 0;
  top: 0;
  height: 29px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  user-select: none;
  border-bottom: 1px solid transparent;

  .act-btn {
    width: 45px;
    height: 29px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    transition: 0.1s ease-in-out all;

    &:hover {
      background: var(--bg-highlight);
      cursor: pointer;
    }

    &:active {
      opacity: 0.6;
    }
  }

  .act-btn-close:hover {
    background: red;
    color: #fff;
  }
}
</style>
