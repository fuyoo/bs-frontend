// @ts-ignore
interface Tree {
  id: string;
  label: string;
  children?: Tree[];
}

function genTreeData (keys: string[], tree: Tree[], splitSymbol: string)  {
  const parseNamespace = (
    step: number,
    deep: number,
    val: string[],
    parent: Tree
  ) => {
    // check is full
    if (step > deep - 1) {
      return;
    }
    // 如果没有children
    if (!parent.children || parent.children.length === 0) {
      // 手动增加一个
      parent.children = [];
    }
    // check is the last children
    if (step === deep - 1) {
      parent.children.push({
        label: val[step],
        id: val.join(splitSymbol),
      });
      return;
    }

    // 查找是否有label存在
    let exists = false;
    for (let item in parent.children) {
      if (parent.children[item].label === val[step]) {
        exists = true;
        parseNamespace(step + 1, deep, val, parent.children[item]);
      }
    }
    if (!exists) {
      let item = {
        label: val[step],
        id: val[step],
      };
      parent.children.push(item);
      parseNamespace(step + 1, deep, val, item);
    }
  };
  keys.forEach((data) => {
    // 拆分数据
    let sp: string[];
    try {
      sp = data.split(splitSymbol);
    } catch (e) {
      sp = [data];
    }
    // 查找是否有第一个命名空间
    let index = -1;
    for (let item in tree) {
      if (tree[item].label === sp[0]) {
        index = Number(item);
        break;
      }
    }
    // 如果第一个不纯在
    if (index === -1) {
      let val = {
        id: sp[0],
        label: sp[0],
      };
      tree.push(val);
      parseNamespace(1, sp.length, sp, val);
    } else {
      parseNamespace(1, sp.length, sp, tree[index]);
    }
  });
};

self.onmessage = function (e) {
  const { keys, val, splitSymbol } = e.data;
  let array = JSON.parse(val)
  genTreeData(keys, array, splitSymbol);
  postMessage(array);
};
