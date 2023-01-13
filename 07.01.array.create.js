// this shows how to create an array

var empty = [];

var primes = [2,3,5,7,11];


// 如果,省略了一些定义，被省略的会被赋予值undefined
var count = [1,,3]; // 有三个元素，中间的那个是undefined

var undefs = [,,]; // 不是三个元素,两个元素，有点奇怪的说明




var a = new Array();

// 指定长度是10
var a = new Array(10);

// 当然更常见的方式是通过指定了数组元素的方式来创建array
var a = new Array(5,4,3,2,1,'testing','testing');
