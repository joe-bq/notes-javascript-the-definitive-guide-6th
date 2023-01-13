//这个讲的是javascript的解构和赋值

let [x,y] = [1,2];
[x,y] = [1+1,y+1];
[x,y] = [y,x];
console.log([x,y]);

//支持不够的元素undefined

let [x,y] = [1];
[x,y] = [1,2,3];
[,x,,y] = [1,2,3,4];


//链式调用， 返回的是右侧的整个数据结构
let first, second, all;
all = [first, second] = [1,2,3,4]; // first = 1, second = 2, all = [1,2,3,4]


//支持嵌套 和结构解析（对象解析）
let [one, [twoA, twoB]] = [1,[2,2,5],3]; // one = 1, twoA = 2, twoB = 2.5


let transparent = {r:0.0,g:0.0,b:0.0,a:1.0}; // 一个用 RGBA 值表示的颜色
let {r:red,g:green,b:blue} = transparent; // red = 0.0,green = 0.0, blue=0.0

// 对象解析的高阶用法 
let {sin:sin, cos:cos, tan:tan} = Math;


//嵌套结构举例子
let data = {
    name: "destruction assignment",
    type: "extension",
    impl: [{engine: "spidermonkey", version: 1.7},
        {engine: "rhino", version: 1.7}]
};


let {name: feature, impl: [{engine: impl1, version: v1}, {engine: impl2, version: v2}]} = data;
{
    console.log(feature);
    console.log(impl1);
    console.log(v1);
    console.log(impl2);
}

//这样写是错误的
//author‘s note: 说明javascript的语言在进化
// let ({name: feature, impl: [{engine: impl1, version: v1}, {engine: impl2, version: v2}]} = data) {
//     console.log(feature);
//     console.log(impl1);
//     console.log(v1);
//     console.log(impl2);
// }