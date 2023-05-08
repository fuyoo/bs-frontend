import { ref } from "vue";
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", () => {
  const splitSymbol = ref(localStorage.getItem("splitSymbol") || ":");
  return {
    splitSymbol,
  };
});
