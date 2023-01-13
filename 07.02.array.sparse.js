// 什么情况下会有稀疏数组
// length的值大于元素的个数
a = new Array(5);
a = [];
a[1000] = 0;


// 和书上不一致ho
// 估计是这个方法修改了
var a1 = [,,,]; // 三个元素的ho
var a2 = new Array(3); /// 该数组没有元素
0 in a1; // 都是false
0 in a2; // 都是false


var a1 = [,];
var a2 = [undefined];

0 in a1; // false 没有元素
0 in a2; // true 有元素