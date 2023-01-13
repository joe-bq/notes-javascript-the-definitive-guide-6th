//判断o是否是一个类数组对象
function isArrayLike(o) {
    if (o && typeof o === "object" &&
        isFinite(o.length) && 
        o.length > 0 && 
        Math.floor(o.length) === o.length && 
        o.length < 4294967296) {
            return true;
    } else {
        return false;
    }
}

// 不能写成这个 
//由于存在段路操作，所以
function isArrayLike(o) {
    return (o && typeof o === "object" &&
        isFinite(o.length) && 
        o.length > 0 && 
        Math.floor(o.length) === o.length && 
        o.length < 4294967296);
}