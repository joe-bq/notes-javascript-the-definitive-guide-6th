//本章的主要内容是可扩张型
// 可以看出里，关键的是seal和freeze可以链式的调用
var o = Object.seal(Object.create(Object.freeze({x:1}), {y:{value:2,writable:true}}));

var p = Object.isFrozen(o); // false
var f = Object.isSealed(o); // true