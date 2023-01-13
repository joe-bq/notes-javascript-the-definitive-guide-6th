//作为命名空间的函数

function mymodule() {
    //模块代码
    //这个模块所使用的变量全部都是局部变量
    //而不是污染全局命名空间
}
mymodule();

//定义后马上调用
(function() {
    //模块代码
}());


//代码参考08.03.extend_patched.js
