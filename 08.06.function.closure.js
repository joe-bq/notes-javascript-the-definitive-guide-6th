/**实现闭包 */
var scope = "global scope";
function checkscope() {
    var scope = "local scope";
    function f() { 
        return scope;
    }
    return f();
}

checkscope(); //返回的应该是=>"local scope";


var scope = "global scope";
function checkscope() {
    var scope = "local scope";
    function f() { 
        return scope;
    }
    return f;
}

checkscope()();//返回的值是什么？ 还是会返回的"local scope"
//原因 - local scope的这个作用链是在函数创建的时候就创建的
//如果把函数的定义的空间认为是一个对象，那么这个就可能好理解了
//每一个scope都有一个作用的空间，也就是它的对象


// 通过必报来实现前面提到的value & attributes
var uniqueInteger = (function() {
    var counter = 0;
    return function() {
        return counter++;
    }
}());


function counter() {
    var n = 0;
    return {
        count: function() { return n++; },
        reset: function() { n = 0; }
    }
}

var c = counter(), d = counter();
c.count()
d.count()
c.reset()
d.count()
 

// 函数参数n是一个私有变量
function counter(n) {
    return {
        //属性getter方法返回并给私有计数器var 递增1
        get count() { 
            return n++;
        },
        //
        set count(m) {
            if (m >= n) {
                n = m;
            } else {
                throw Error("count can only be set to a larger value");
            }
        }
    };
}

var c = counter(1000);
c.count
c.count
c.count = 2000
c.count
c.count = 2000


//使用闭包实现的那个addPrivateProperty() 可以08.04.addPrivateProperty.js



//这里介绍一个关于闭包的错误的示范 
var o = {};

//增加属性存储器方法, setName(), getName()
addPrivateProperty(o, "Name", function(x){return typeof x == "string"});


o.setName("Frank");//设置一个属性名字
console.log(o.getName()); //得到一个属性
o.setName(o);//试图设置一个错误类型的值





//循环使用闭包-正确的示范
function constv(v){ return function() { return v; }};

var funcs = new Array(5);
for (var i = 0; i < 10; i++) {
    funcs[i] = constv(i);
}

funcs[5]();


// -- 错误的示范 - 由于共享了闭包，导致返回的值都是一样的
//错误的示范
function constfuncs(){
    var funcs = [];
    for (var i = 0; i < 10; i++) {
        funcs[i] = function() { return i; }
    }
    return funcs;
}

var funcs = constfuncs();
funcs[5]();

//关于闭包访问的其他的说明
//
var self = this;
var outerArguments = argumnts; // 保存起来已便嵌套的函数能使用到他们
