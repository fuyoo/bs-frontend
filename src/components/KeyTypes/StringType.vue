<template>
  <div class="_key_string">
    {{ data }}
      <div style="height: 1800px"></div>
  </div>
</template>

<script lang="ts" setup>
import { queryKey } from "@/api/keys";
import { ref, watch } from "vue";

const props = defineProps<{
  k: string;
  db: number;
  id: string;
  type: string;
}>();

watch(
  () => props.k,
  (r) => {
    if (props.type === "string" && r !== "") queryFn();
  }
);
let data = ref("");
const queryFn = () => {
  queryKey<string>(props).then((res) => {
    data.value = res.data;
  });
};
queryFn();
</script>

<style scoped lang="scss">
._key_string {
  margin: 15px;
}
</style>
