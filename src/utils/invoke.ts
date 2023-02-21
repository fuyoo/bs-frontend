import {invoke} from "@tauri-apps/api";
import message from "@/utils/message";

export default (path: string, payload?: object) => {
  return new Promise((resolve, reject) => {
    message.loading();
    invoke("routes", {
      path,
      payload: payload ? JSON.stringify(payload) : ""
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
      .catch(err => reject(err))
      .finally(() => {
        message.closeLoading();
      });
  });
}