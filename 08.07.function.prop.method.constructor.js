//函数的属性、方法和构造函数
//例子-实际的长度和期望的长度

//8.7.1 length property
// 问题-为什么这里不使用 argmunts来检查
function check(args) { 
    var actual = args.length;
    var expected = args.callee.length;

    if(actual !== expected) {
        throw Error("Expected " + expected + "args; but got " + actual);
    }
}

//这是我自己写的，存在复用性的问题
function checkArgument() { 
    debugger

    var actual = arguments.length;
    var expected = arguments.callee.caller.length;
    if(actual !== expected) {
        throw Error("Expected " + expected + "args; but got " + actual);
    }
}

function f(x,y,z) {
    check(arguments);
    return x + y + z;
}

function f(x,y,z) {
    checkArgument();
    return x + y + z;
}


//8.7.2 prototype 属性

//8.7.3 call() 方法和apply()方法
//ECMScript 5的严格模式中，call()和apply()的第一个参数都会变成是 this.的值； 哪怕传入的是null，或者是undefined
//非严格模式下，null，或者是undefined 会被全局对象替代
//区别在于
// call 传入所有的参数
//apply 传入一个数组

f.call(o,1,2);
f.apply(o,[1,2]);

//这里展示一个aop的写法
function trace(o,m) { 
    var orignal = o[m];
    o[m] = function() { 
        console.log(new Date(), "Entering:" + m);
        //这里不要写成了original.apply(o,arguments);
        //但是写成了original.apply(o,arguments); 感觉也没有问题
        var result = orignal.apply(this, arguments);
        console.log(new Date(), "Exiting:" + m);
        return result;
    }
}

var o = {m: function() { console.log('calling o.m();')}};
trace(o,'m');
o.m();


//bing方法
//curry化函数
function f(y) { 
    return this.x + y;
}

var o = {x: 1};
var g = f.bind(o);
g(2); // => 3


function bind(f, o) { 
    //为什么这么写，原因是在于f.bind是在Function.prototype上的值
    if (f.bind) {
        return f.bind(o);
    } else {
        return f.apply(o, arguments);
    }
}

//例子

var sum = function(x,y) { return x + y; }; 
var succ = sum.bind(null, 1);
succ(2); // null代表的是全局的变量？ 

function f (y,z) { return this.x + y + z; };
var g = f.bind({x:1}, 2);
g(3); // 1 + 2 + 3  -》 1来自于对象，2来自于绑定，3来自于参数



// 来自于文件： 08.05.bind2.js 
if (!Function.prototype.bind) {
    Function.prototype.bind = function(o /*, args */) {
        // Save the this and arguments values into variables so we can
        // use them in the nested function below.
        var self = this, boundArgs = arguments;

        // The return value of the bind() method is a function
        return function() {
            // Build up an argument list, starting with any args passed
            // to bind after the first one, and follow those with all args
            // passed to this function.
            var args = [], i;
            for(i = 1; i < boundArgs.length; i++) args.push(boundArgs[i]);
            for(i = 0; i < arguments.length; i++) args.push(arguments[i]);
            
            // Now invoke self as a method of o, with those arguments
            return self.apply(o, args);
        };
    };
}

//构造函数



var f = new Function("x", "y", "return x * y;");

//他和如下的方法是等价的
var f = function(x, y) { return x * y; };


//这里有一个特殊的点， 那就是Function的构造函数并不是坐拥在词法作用域
//他主要是作用在顶层函数

var scope = "global";
function constructFunction() {
    var scope = "local";
    return new Function("return scope");
}

// 这一行返回global， 原因Function默认的作用域是在全局
constructFunction()(); // => "global"


//可调用对象
//可调用对象的概念和类数组对象很像， 都是可以当作可调用对象来处理
function isfunction(x) { 
    return Object.prototype.toString.call(x) === '[object Function]';
}