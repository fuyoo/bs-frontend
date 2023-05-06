/**
 * icon just support svg content,do not use <svg></svg>.
 * instead svg content to replace it. such as <path></path>.
 */
import "@/style/contextmenu.scss";
import { isRef } from "vue";

let inited = false;
const contextmenu = {
  // 及他自己的所有子节点都挂载完成后调用
  mounted(el: Element, binding: any) {
    // create dom
    const genPopMenuContainer = (): Element => {
      const div = document.createElement("div");
      div.setAttribute("id", "_dir_ctx_menu");
      return div;
    };
    // remove dom
    const removePopMenuContainer = (div?: Element) => {
      const dom = div || document.querySelector("#_dir_ctx_menu");
      if (dom) {
        document.documentElement.removeChild(dom);
      }
    };
    // create menu items
    const genPopMenu = (
      data: { label: string; handler: (args: any) => void; icon?: string }[]
    ): Element => {
      //check dom is exists and remove it
      removePopMenuContainer();
      // then create a container
      const div = genPopMenuContainer();
      // append menu items
      data.forEach((item,index) => {
        //create a child dom
        const dom = document.createElement("div");
        // set class
        dom.setAttribute("class", "_ctx_menu_item");
        // set content
        dom.innerHTML = `<div class="_ctx_menu_item_icon">
                        ${
                          item.icon
                            ? `<svg fill="currentColor" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" >${item.icon}</svg>`
                            : ""
                        }
                        </div>
                        <div class="_ctx_menu_item_label">${
                          isRef(item.label) ? item.label.value : item.label
                        }</div>`;
        dom.onclick = (evt) => {
          evt.stopPropagation();
          try {
            item.handler(binding.arg);
          } catch (e) {
            console.error(e);
          }
          removePopMenuContainer();
        };
        div.appendChild(dom);
        if (index < data.length -1) {
          const line = document.createElement("div")
          line.setAttribute("class","_ctx_menu_item_line")
          div.appendChild(line)
        }

      });
      return div;
    };
    // @ts-ignore
    el.addEventListener("contextmenu", (evt: MouseEvent) => {
      evt.preventDefault();
      evt.stopPropagation();
      const div = genPopMenu(binding.value);
      div.setAttribute(
        "style",
        `left:${evt.x}px;top:${evt.y}px;position:absolute`
      );
      document.documentElement.appendChild(div);
    });
    if (!inited) {
      // hide contextmenu
      document.addEventListener("click", () => {
        removePopMenuContainer();
      });
      inited = true;
    }
  },
};

export default {
  name: "contextmenu",
  directive: contextmenu,
};
