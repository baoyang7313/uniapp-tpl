/**
 * 表格时间格式化
 */
export function formatDate(cellValue) {
    if (cellValue == null || cellValue == "") return "";
    var date = new Date(cellValue);
    var year = date.getFullYear();
    var month =
        date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1;
    var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minutes =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var seconds =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    return (
        year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds
    );
}
/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
    if (!source && typeof source !== "object") {
        throw new Error("error arguments", "deepClone");
    }
    const targetObj = source.constructor === Array ? [] : {};
    Object.keys(source).forEach((keys) => {
        if (source[keys] && typeof source[keys] === "object") {
            targetObj[keys] = deepClone(source[keys]);
        } else {
            targetObj[keys] = source[keys];
        }
    });
    return targetObj;
}
//     /**平拍tree*/
export function flatTree(arr) {
    return arr.reduce((res, item) => {
        const _item = deepClone(item);
        if (Array.isArray(_item.children)) {
            delete _item.children;
            return [...res, _item, ...this.flatTree(item.children)];
        }
        return [...res, _item];
    }, []);
}
// list转tree
export function transformTree(data, id, parentId, children) {
    // console.log(data,'树=====',id, parentId, children);
    const copyData = deepClone(data)
    let config = {
        id: id || 'id',
        parentId: parentId || 'parentId',
        childrenList: children || 'children'
    };

    var childrenListMap = {};
    var nodeIds = {};
    var tree = [];

    for (let d of copyData) {
        let parentId = d[config.parentId];
        if (childrenListMap[parentId] == null) {
            childrenListMap[parentId] = [];
        }
        nodeIds[d[config.id]] = d;
        childrenListMap[parentId].push(d);
    }

    for (let d of copyData) {
        let parentId = d[config.parentId];
        if (nodeIds[parentId] == null) {
            tree.push(d);
        }
    }

    for (let t of tree) {
        adaptToChildrenList(t);
    }

    function adaptToChildrenList(o) {
        if (childrenListMap[o[config.id]] !== null) {
            o[config.childrenList] = childrenListMap[o[config.id]];
        }
        if (o[config.childrenList]) {
            for (let c of o[config.childrenList]) {
                adaptToChildrenList(c);
            }
        }
    }
    return tree;
}
