// define tree struct
export interface Tree {
  id: string;
  label: string;
  children?: Tree[];
}

export const offAutoCorrect = () => {
  const inputs = document.querySelectorAll("input");
  // disable the first word uppercase
  inputs.forEach((item: Element) => {
    item.setAttribute("autocorrect", "off");
  });
};
