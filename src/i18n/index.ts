import chinese from "@/i18n/chinese";
import en from "@/i18n/en";
export const langs = {
  "chinese": {
    lang: "简体中文",
    value: "chinese",
    source: chinese
  },
  "en": {
    lang: "English",
    value: "en",
    source: en
  }
};
const local = localStorage.getItem("lang") || "chinese";
export const lang = (param: string) => {
  return eval(`langs.${local}.source.${param}`);
};
export default {
  install(app: any) {
    app.config.globalProperties.$lang = lang;
  }
};
