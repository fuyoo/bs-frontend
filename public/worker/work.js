function genTreeData(keys, tree, splitSymbol) {
    var parseNamespace = function (step, deep, val, parent) {
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
                id: val.join(":")
            });
            return;
        }
        // 查找是否有label存在
        var exists = false;
        for (var item in parent.children) {
            if (parent.children[item].label === val[step]) {
                exists = true;
                parseNamespace(step + 1, deep, val, parent.children[item]);
            }
        }
        if (!exists) {
            var item = {
                label: val[step],
                id: val[step]
            };
            parent.children.push(item);
            parseNamespace(step + 1, deep, val, item);
        }
    };
    keys.forEach(function (data) {
        // 拆分数据
        var sp;
        try {
            sp = data.split(splitSymbol);
        }
        catch (e) {
            sp = [data];
        }
        // 查找是否有第一个命名空间
        var index = -1;
        for (var item in tree) {
            if (tree[item].label === sp[0]) {
                index = Number(item);
                break;
            }
        }
        // 如果第一个不纯在
        if (index === -1) {
            var val = {
                id: sp[0],
                label: sp[0]
            };
            tree.push(val);
            parseNamespace(1, sp.length, sp, val);
        }
        else {
            parseNamespace(1, sp.length, sp, tree[index]);
        }
    });
}
;
self.onmessage = function (e) {
    var _a = e.data, keys = _a.keys, val = _a.val, splitSymbol = _a.splitSymbol;
    var array = JSON.parse(val);
    genTreeData(keys, array, splitSymbol);
    postMessage(array);
};
