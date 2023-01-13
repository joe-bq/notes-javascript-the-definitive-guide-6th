//inheritance.js
//这里展示如何使用constructor, methors, statics来定义一个类
function defineClass(constructor, methods, statics) {
    if (methods) {
        extend(constructor.prototype, methods);
    } else {
        extend(constructor, statics);
    }
    return constructor;
}



//这里对它  09.03.Complex 上面的Complex的对象使用


var c = new Complex(2, 3);
var d = new Complex(c.i, c.r);

c.add(d).toString();
Complex.parse(c.toString())
    .add(c.neg())
    .equals(Complex.ZERO);

Complex.prototype.toString = function() { 
    with (this) { 
        return "{"  + r + "," + i + "}"
    }
}