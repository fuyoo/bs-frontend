<script setup lang="ts">
import {useRoute} from "vue-router";
const route = useRoute()

</script>

<template>
  <div>{{route.params.id}}</div>
</template>

<style scoped lang="scss">

</style>