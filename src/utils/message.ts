import { Message } from "@arco-design/web-vue";
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
      gl = Message.success(config);
    },
    warning(config: any) {
      close();
      gl = Message.warning(config);
    },
    error(config: any) {
      close();
      gl = Message.error(config);
    },
    info(config: any) {
      close();
      gl = Message.info(config);
    },
  };
})();
