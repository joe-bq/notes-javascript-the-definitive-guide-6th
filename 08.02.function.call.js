//如何调用函数


// 判断一个函数是否是严格模式
//非严格模式下，this 的值是全局对象；
var strict = (function() { return !this;}());


//方法调用和this的关系
var calculator = { // 对象直接量
    operand1: 1,
    operand2: 2,
    add: function() {
        this.result = this.operand1 + this.operand2;
    }
};

//调用的关系
calculator.add();
calculator.result;

//需要说明的是this是一个关键字，它不是变量
//代表的含义?
//使用self的主要作用在嵌套函数中，没有this
var o = {
    m: function() {
        var self = this;
        console.log(this === o);
        f();

        function f()  {
            console.log(this === self); // this == undefine 或者是全局变量
            console.log(this === o); // this == undefined 或者是全局变量
            console.log(self === o); // true
        }
    }
};


//构造函数
//如果一个没有形参数的构造函数
//
var o = new Object();
var o = new Object;

//另外，
//构造函数上的this对象不是调用时候的调用对象，一直都是新创建中的对象


//另外一种调用方式是通过call或者是apply的调用方式调用