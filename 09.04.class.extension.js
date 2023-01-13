//java.class , extension class 

//扩展这个complex 方法
Complex.prototype.conj = function() { 
    return new Complex(this.r,-this.i); 
}


//其他的例子， 我们给Number提供其他的方法， 比如说 times
//多次调用这个函数f, 传如懿哥迭代函数
//n.times (function(n) { console.log(n+ "hello");})
//上面的例子中， 没有指定context
Number.prototype.times = function(f, context) {
    var n = Number(this);
    for (var i = 0; i < n; i++) {
        f.call(context, i);
    }
};


//这里再定义一个ES5下的String.trim()方法
String.prototype.trim = String.prototype.trim || function() { 
    if (!this) { return this; }
    return this.replace(/^s+|s+$/g, "");
}

//返回函数的名字， 如果它有那么， 直接返回， 如果没有
//将函数转换为字符串并从中提取名字
//
Function.prototype.getName = function() {
    return this.name || this.toString().match(/function \s*([^()*])\(/)[1];
}


