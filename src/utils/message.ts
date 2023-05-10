import { ElMessage } from "element-plus";
import i18n from "i18next";

const icon = `<svg data-v-b4e148ca="" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32zm0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32zm448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32zm-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32zM195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248zM828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0zm-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0z"></path></svg>`;
export default (function () {
  let gl: any = null;
  const close = () => {
    if (gl != null) {
      gl.close();
      gl = null;
    }
  };
  return {
    success(config: any) {
      close();
      gl = ElMessage.success(config);
    },
    warning(config: any) {
      close();
      gl = ElMessage.warning(config);
    },
    error(config: any) {
      close();
      gl = ElMessage.error(config);
    },
    info(config: any) {
      close();
      gl = ElMessage.info(config);
    },
    close(){
      close()
    },
    loading(txt?: string) {
      // first get the loading dom
      let fd = document.querySelector("#_loading_dom");
      if (fd !== null) {
        document.body.removeChild(fd);
        document.body.removeAttribute("style");
      }
      fd = document.createElement("div");
      fd.setAttribute("id", `_loading_dom`);
      fd.innerHTML = `<div class="_loading_tip">
        <span class="el-icon is-loading _loading_icon">${icon}</span>
        <span class="_loading_txt">${
          txt ? txt : i18n.t("加载中")
        }</span></div>`;
      document.body.setAttribute("style", "overflow:hidden");
      document.body.appendChild(fd);
    },
    closeLoading() {
      const fd = document.querySelector("#_loading_dom");
      if (fd !== null) {
        document.body.removeChild(fd);
        document.body.removeAttribute("style");
      }
    },
  };
})();
