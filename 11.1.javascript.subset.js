// 一些常用的jvascript安全性的要求

//eval(), function()
//禁止使用this关键字
//禁止使用with语句
//禁止使用全局变量
//禁止使用比如说 arguments, 和他两个属性  caller, callee
//静态分析可以有效的防止带点(.)属性存取表达式


//推荐 
// const表达式 

const pi = 3.14;
pi = 4;
const pi = 4;
var pi = 4;

//推荐， let
// let不是保留字， javaScript 1.7以及以后的版本才能识别， 需要手动增加版本号才能使用
//作用是 块级作用域的变量定义



function oddsums(n) { 
    let total = 0, result = [];

    for (let x = 1; x <= n; x++) { 
        let odd = 2*x-1;
        total += odd;
        result.push(total);
    }
    //这里使用x或者是odd会导致一个引用错误
    return result;
}


oddsums(5);



//关于let语句的一个说明
//声明语句的let - 变量作用域外内计算
//循环初始化器中使用let - 变量作用域外内计算

//author's note: “下面的代码不生效” - 看来是做了很多的改进 
let x = 1;
for (let x = x +  1; x < 5; x++ ) 
    console.log(x);  // 输出 2 ~ 5
{
    let x = x + 1;
    console.log(x); // 输出 NaN
}