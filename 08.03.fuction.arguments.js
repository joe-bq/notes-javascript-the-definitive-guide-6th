//函数的实参和形式参数
function getPropertyNames(o, /* optional */a) {
    if (a === undefined) a = [];
    for (var prop in o) {
        a.push(prop);
    }
    return a;
}

//使用一个比较自然的javascript的写法
function getPropertyNames(o, /* optional */a) {
    a = a || [];
    for (var prop in o) {
        a.push(prop);
    }
    return a;
}

//眼熟乳腺癌的调用方式
o = { x: 1, y: 2 };
p = { z: 3 };
var a = getPropertyNames(o);
getPropertyNames(p, a);

//如果参数 的个数是可以可以变化的
//这个方法告诉你如何去使用这个
function f(x, y, z) {
    //首先，验证入了实际参数的个数
    if (arguments.length != 3) {
        throw new Error("Function f called with " + arguments.length + " arguments, but it expects 3 arguments");
    }
    //
}


function max(/*optional*/) {
    var max = Number.NEGATIVE_INFINITY;
    //now iterate 
    for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] > max) {
            max = arguments[i];
        }
    }
    return max;
}

var largest = max(1, 10, 100, 3, 2, 1000, 4, 5, 1000, 6);



//这里说明一下实参数和型参数的别名
function f(x) {
    console.log(x);
    arguments[0] = nul;
    console.log(x);
}

//callee 和caller函数
//非严格模式下caller可能不能有效，但是callee是有效的

var factorial = function (x) {
    if (x < 1) {
        return 1;
    }
    return x * arguments.callee(x - 1);
}

//编程模式的说明
function arraycopy(/*array*/ from,/*index*/ from_start, /*array*/ to, /*index*/ to_start,/*integer*/ length) {

}


//我们封装这个方法
function easycopy(args) {
    arrayccopy(args.from,
        args.from_start || 0,
        args.to,
        args.to_start || 0,
        args.length);
}

//这样的话，调用的时候
var a = [1, 2, 3, 4], b = [];
easycopy({ from: a, to: b, length: 4 });


//我们这里来讲一下如何来识别实参类型
//检查做的比较好， 但太过严格
function sum(a) {
    if (isArrayLike(a)) {
        var total = 0;
        for (var i = 0; i < a.length; i++) {
            var element = a[i];

            if (element == nul) { //element == null 或者是 undefined
                continue;
            }
            if (isFinite(element)) {
                total += element;
            } else {
                throw new Error("sum(): element must be finite numbers");
            }
        }
        return total;
    }
    else throw new Error("sum(): argument must be array-like");
}


//上面方法的灵活的写法
function flexisum(a) {
    var total = 0;
    for (var i = 0; i < arguments.length; i++) {
        var element = arguments[i], n;
        if (element == null) {
            continue;
        }

        if (isArray(element)) {
            n = flexisum.apply(this, element);
        } else if (typeof element == "function") { //如果是方法，调用
            n = element();
        } else {
            n = Number(element);
        }
        
        if (isNaN(n)) { //如果不是一个数字
            throw new Error("flexisum(): cannot convert " + element + " to a number");
        }
        total += n;
    }
    return total;
}
//上面不能写成是 i < a.length
// 原因 flexisum([1,[1,2]]);
// 第一次调用
// flexisum(1, ...)
// 第二次调用
//flexisum(1,2)
//结果a只绑定了
//1