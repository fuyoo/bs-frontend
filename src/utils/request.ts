import { invoke } from "@tauri-apps/api";
import message from "@/utils/message";

const numberKey = ["proxyPort", "port"];
export interface Response<T> {
    code: number,
    data: T,
    msg: string
}
export default <T>(
  path: string,
  payload?: object
): Promise<Response<T>> => {
    console.info(":====================== request payload ======================:")
    console.info(payload)
  return new Promise((resolve, reject) => {
    message.loading();
    invoke("routes", {
      path,
      payload: payload
        ? JSON.stringify(payload, (k, v) => {
            if (numberKey.includes(k)) {
              return Number(v);
            }
            if (v === null) {
              return "";
            } else {
              return v;
            }
          })
        : "",
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
};
