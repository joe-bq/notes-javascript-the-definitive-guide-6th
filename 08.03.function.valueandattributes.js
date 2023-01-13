/**作为值的函数 */
//关键点是函数可以作为值传递

//可以参考source code 

//这一章主要介绍的是自定义函数的属性
uniqueInteger.counter = 0;
function uniqueInteger() {
    return uniqueInteger.counter++;
}


// 我们把结果存在函数的属性中
function factorial(n) { 
    //参数判断
    if(isFinite(n) && n > 0 && n == Math.round(n)) {
        if (!(n in factorial)) {
            return n * factorial(n-1);
        }
        return factorial[n];
    }else {
        return NaN;
    }
}
factorial[1] = 1;
