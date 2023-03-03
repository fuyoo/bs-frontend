import {invoke} from "@tauri-apps/api";
import message from "@/utils/message";

const numberKey = ["proxyPort", "port"];
export default (path: string, payload?: object) => {
  return new Promise((resolve, reject) => {
    message.loading();
    invoke("routes", {
      path,
      payload: payload ? JSON.stringify(payload, (k, v) => {
        if (numberKey.includes(k)) {
          return Number(v);
        }
        if (v === null) {
          return "";
        } else {
          return v;
        }
      }) : ""
    })
      .then((res: any) => {
        const data = JSON.parse(res);
        if (data.code !== 200) {
          message.error(data.msg);
          reject(data.msg);
        } else {
          resolve(data);
        }
      })
      .catch((err: any) => {
        message.error(err.toString());
        reject(err);
      })
      .finally(() => {
        message.closeLoading();
      });
  });
}
