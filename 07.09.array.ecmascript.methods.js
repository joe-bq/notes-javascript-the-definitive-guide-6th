//foreach
var data = [1,2,3,4,5];
var sum = 0;

data.forEach(function(value) { sum += value; });
sum 
// 这个表明可以获取到每个值+1
data.forEach(function(value,i,a) { a[i] = value + 1; });
data


//这里的t代表的含义可以找到什么
function foreach(a,f,t) {
    try { a.forEach(f,t);}
    catch (e) { 
        if (e === foreach.break) return;
        else throw e;
    }
}
foreach.break = new Error("StopIteration");



//map
//比如，每个元素都
a = [1,2,3];
b = a.map(function(x) { return x * x ;});
c = a.map(function(x) { return x ** x ;});

//filter
a = [5,4,3,2,1]
smallvalues = a.filter(function(x) { return x < 3; });


// dense
var dense = sparse.filter(function() { return true; });
var dense = sparse.filter(function(x) { return x !== undefined && x !== null; });
var dense = sparse.filter(function(x) { return x != null; });

//判断使用every() and some()
a = [1,2,3,4,5];
a.every(function(x) { return x < 10; });
a.every(function(x) { return x % 2 === 0; });

a.some(function(x) { return x < 10; });
a.some(function(x) { return x % 2 === 0; });

//reduce 和 reduceRight
//一种递归的实现
a = [1,2,3,4,5];
var sum = a.reduce(function(x,y) { return x + y;}, 0);
var product = a.reduce(function(x,y) { return x * y;}, 1);
var max = a.reduce(function(x,y) { return (x>y)?x:y;});

//indexOf 和lastIndexOf
a = [0,1,2,1,0];
a.indexOf(1); // =>1, a[1]是1
a.lastIndexOf(1); // =>3, a[3]是1
a.indexOf(3); // =>-1, 没有

//function to search all 
function findall(a, x) { 
    var results = [],
        len = a.length,
        pos = 0;
    while (pos < len) {
        pos = a.indexOf(x, pos);
        if (pos === -1) {
            break;
        }
        results.push(pos);
        pos = pos + 1;
    }
    return results;
}

//这是一个查找

//类型判断
//新增的类型是isArray()
Array.isArray([]); //true
Array.isArray({}); //false

// instanceof 判断
[] instanceof Array;
({}) instanceof Array;
//instanceof的问题问题在于
//1.多窗体
//2.一个窗体的函数/全局对象在另外一个窗体不通用


//一个判断是不是数组的方法
var isArray = Function.isArray || function(o) {
    return typeof o === 'object' && 
        Object.prototype.toString.call(o) === "[object Array]";
};

//类数组对象的方法
var a = {};
for (var i = 0; i < 10; i++) {
    a[i] = i;
}

a.length = 10;


var total = 0;
for (var i = 0; i < 10; i++) {
   total += a[i];
}


//这里说明一下,数组的方法在所类数组对象上也可以用
var a = {"0":"a","1":"y","2":"c",length:3};
Array.prototype.join.call(a, "+");
Array.prototype.slice.call(a, 0);
Array.prototype.map.call(a, function(x) {
    return x.toUpperCase();
}); // ["A","B","C"]

//还有这样的写法 - firefox支持
//var a = {"0":"a","1":"y","2":"c",length:3};
//Array.join(a, "+");
//Array.slice(a, 0);
//Array.map(a, function(x) {
//    return x.toUpperCase();
//});

//

//作为数组的字符串
//这个用法是比较普遍的
var s = "test";
s.charAt(0);
s[1];

//另一个例子是考虑
var s = "javascript";
Array.prototype.join.call(s, " ");
Array.prototype.filter.call(s, 
    function(x) {
        return x.match(/[^aoeui]/)
    }).join("");