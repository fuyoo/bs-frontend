import I18NextVue from "i18next-vue";
import i18next from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

/**
 * todo: should be save to this info to server and fixed it!
 * @param lngs
 * @param ns
 * @param key
 * @param fallbackValue
 * @param updateMissing
 * @param options
 */
const missingKeyHandler = (
  lngs: readonly string[],
  ns: string,
  key: string,
  fallbackValue: string,
  updateMissing: boolean,
  options: any
) => {
  const data = { lngs, ns, key, fallbackValue, updateMissing, options };
  const control = new AbortController();
  fetch("/log", {
    method: "POST",
    signal: control.signal,
    body: JSON.stringify(data),
  }).catch(() => {});
  control.abort("// todo:");
};
/**
 * 等到加载语言文件加载完成
 * 配合vue原生<Suspense />组件使用
 */
export const i18nextPromise = i18next
  .use(Backend)
  .use(LanguageDetector)
  .init({
    debug: true,
    ns: ["common"],
    fallbackLng: "zh",
    lowerCaseLng: true,
    saveMissing: true,
    missingKeyHandler,
  });

export default function (app: import("vue").App) {
  app.use(I18NextVue, { i18next });
  return app;
}
