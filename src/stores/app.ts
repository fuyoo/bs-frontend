import { ref } from "vue";
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", () => {
  const splitSymbol = ref(localStorage.getItem("splitSymbol") || ":");
  const enableNameSpace = ref(
    localStorage.getItem("enableNameSpace") === "true"
  );
  const keyCount = ref(
      Number(localStorage.getItem("keyCount") || 500)
  );
  return {
    splitSymbol,
    enableNameSpace,
    keyCount
  };
});
