//展示使用原型属性
var p = {x:1};
var o = Object.create(p);

p.isPrototypeOf(o);
Object.prototype.isPrototypeOf(o);

// 注意这个isPrototypeOf方法是instanceof的实现
// 注意

// 如下的方法会返回如下的值
Object.prototype.toString.call(new Date())
// '[object Date]'

// 如果 o 是null,或者是 undefined, o == null 会返回true 
function classof(o) {
    if (o === null) return "Null";
    if (o === undefined) return "Undefined";
    return Object.prototype.toString.call(o).slice(8,-1);
}
