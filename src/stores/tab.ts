import {ref} from "vue";
import type {Ref} from "vue";
import {defineStore} from "pinia";
import type {TabProps} from "@/components/TabBar/type";
import {useRoute} from "vue-router";
import router from "@/router";

export const useTabStore = defineStore("tab", () => {
  const route = useRoute();
  const tabs: Ref<TabProps[]> = ref([]);
  /**
   * init tab data
   */
  const init = () => {
    // 清理home目录下的tab聚焦
    if (route.path.includes("/home")) {
      tabs.value = JSON.parse(sessionStorage.getItem("tabs") || "[]")
        .map((item: TabProps) => {
          item.active = false;
          return item;
        });
      //focus("home");
    } else {
      tabs.value = JSON.parse(sessionStorage.getItem("tabs") || "[]");
    }
  };
  init();
  /**
   * tab focus
   * @param id
   */
  const focus = (id: string) => {
    tabs.value.forEach((item) => {
      if (item.id === id) {
        item.active = true;
      } else {
        item.active = false;
      }
    });
    sessionStorage.setItem("tabs", JSON.stringify(tabs.value));
    router.replace(`/connection/${id}`);
  };
  /**
   * append a tab item
   * @param data
   */
  const append = (data: TabProps) => {
    const index = indexOf(data.id);
    if (index === -1) {
      data.active = true;
      tabs.value.push(data);
      sessionStorage.setItem("tabs", JSON.stringify(tabs.value));
    } else {
      focus(data.id);
    }
  };
  /**
   * remove a tab item
   * @param id
   */
  const close = (id: string): TabProps | null => {
    const index = indexOf(id);
    if (index > -1) {
      tabs.value.splice(index, 1);
      // focus to the last item
      if (tabs.value.length > 0) {
        return tabs.value[tabs.value.length - 1];
      }
    }
    return null;
  };
  /**
   * move a tab item on the list start
   * @param id
   */
  const moveToStart = (id: string) => {
    // first remove
    const res = tabs.value.splice(indexOf(id), 1);
    // then push them to the start
    if (res && res.length > 0) {
      tabs.value.unshift(res[0]);
      sessionStorage.setItem("tabs", JSON.stringify(tabs.value));
    }
  };
  /**
   * get the index from the tab list
   * @param id
   */
  const indexOf = (id: string): number => {
    for (const i in tabs.value) {
      const item = tabs.value[i];
      if (item.id === id) {
        return Number(i);
      }
    }
    return -1;
  };
  return {tabs, append, close, focus, moveToStart};
});
