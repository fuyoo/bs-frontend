import {ref} from "vue";
import type {Ref} from "vue";
import {defineStore} from "pinia";
import type {TabProps} from "@/components/TabBar/type";

export const useTabStore = defineStore("tab", () => {
  const tabs: Ref<TabProps[]> = ref([]);
  const append = (data: TabProps) => {
    tabs.value.push(data);
  };
  const remove = (index: number) => {
    tabs.value.splice(index, 1);
  };
  return {tabs, append, remove};
});
