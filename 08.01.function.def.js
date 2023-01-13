//这个主要是考查如何定义函数

function printprops(o) { 
    for (var p in o) { 
        console.log(p + ":  " + o[p] + "\n");
    }
}

// 计算两个点的笛卡尔积
function distance(x1,y1,x2,y2) { 
    var dx = x1 - x2;
    var dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy );
}


function factorial(n) { 
    if (n < 1) { 
        return 1;
    }
    return factorial(n-1) * n;
}

 var square = function(x) { return x * x ;}

 // 函数表达式也包含名称，在递归的时候很有用
 var f = function fact(x) {
    if (x <= 1) {
        return 1;
    } else {
        return x * fact(x-1);
    }
 }


 // 比较特殊的点是，可以在函数定义以后马上调用
 data.sort(function(a,b) { return a - b; });
 var tensquared = (function(x) { return x * x ;}(10));
 

 //特殊的点是，如果不返回,默认的返回值是undefined

 //函数可以嵌套的定义
 function hypotenuse(a,b) {
    function square(x) { return x * x;};
    return Math.sqrt(square(a) + square(b));
 }

