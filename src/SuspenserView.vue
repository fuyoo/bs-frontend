<script lang="ts" setup>
import App from "./App.vue";
</script>

<template>
  <Suspense>
    <template #default>
      <App />
    </template>
    <template #fallback>
      <div id="pre-loading">
        <div class="coffee">
          <div></div>
          <div></div>
          <div></div>
        </div>
        <span class="tips">
          loading&nbsp;
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </div>
    </template>
  </Suspense>
</template>
<style lang="scss">
@keyframes toNone {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

#pre-loading {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #2c3e50;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

#pre-loading .tips {
  color: #fff;
  padding-top: 10px;
  font-size: 10px;
  display: flex;
  line-height: 1;
}

#pre-loading .tips span {
  opacity: 0;
  animation: toNone 0.4s infinite;
}

#pre-loading .tips span:nth-child(2) {
  animation-delay: 0.1s;
}

#pre-loading .tips span:nth-child(3) {
  animation-delay: 0.2s;
}

@-webkit-keyframes coffee {
  100% {
    opacity: 0;
    -webkit-transform: translateY(-200%);
    transform: translateY(-200%);
  }
}

@keyframes coffee {
  100% {
    opacity: 0;
    -webkit-transform: translateY(-200%);
    transform: translateY(-200%);
  }
}

#pre-loading .coffee {
  background: #fff;
  display: grid;
  border-radius: 4px;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr;
  height: 40px;
  position: relative;
  width: 40px;
  padding: 2px;
  justify-items: center;
}

#pre-loading .coffee:before {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  content: "";
  height: 26px;
  width: 20px;
  border: 4px solid #fff;
  position: absolute;
  top: 50%;
  margin-top: -13px;
  margin-left: -10px;
  left: 100%;
  border-radius: 4px;
}

#pre-loading .coffee div {
  height: 20px;
  width: 8px;
  background: #fff;
  opacity: 0.3;
  -webkit-animation: coffee 2s infinite;
  animation: coffee 2s infinite;
}

#pre-loading .coffee div:nth-child(1) {
  -webkit-animation-delay: 0.4s;
  animation-delay: 0.4s;
}

#pre-loading .coffee div:nth-child(2) {
  -webkit-animation-delay: 1s;
  animation-delay: 1s;
}

#pre-loading .coffee div:nth-child(3) {
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}
</style>
