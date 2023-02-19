import { ref } from "vue";
import { defineStore } from "pinia";

export const appStore = defineStore("app", () => {
  const theme = ref(localStorage.getItem("theme") || "light");
  const dark = () => {
    localStorage.setItem("theme", "dark");
    theme.value = "dark";
    document.body.setAttribute("arco-theme", "dark");
  };
  const light = () => {
    localStorage.setItem("theme", "light");
    theme.value = "light";
    document.body.removeAttribute("arco-theme");
  };
  const init = () => {
    if (theme.value === "dark") {
      dark();
    } else {
      light();
    }
  };
  return { theme, dark, light, init };
});
