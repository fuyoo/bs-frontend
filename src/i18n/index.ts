import chinese from "@/i18n/chinese";
import en from "@/i18n/en";
export const langs = [{lang: "简体中文", value: "chinese"}, {
  lang: "English",
  value: "en"
}];
const local = localStorage.getItem("lang") || "chinese";
export const lang = (param: string) => {
  return eval(`${local}.${param}`);
};
export default {
  install(app: any) {
    app.config.globalProperties.$lang = lang
  }
};
