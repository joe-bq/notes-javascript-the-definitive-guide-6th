//这里探讨的是如何做函数式编程
var data = [1,1,3,5,5];

var total = 0;
for (var i = 0; i < data.length; i++) { 
    total += data[i];
}

var mean = total / data.length; // 平均数是3


// 计算标准差
total = 0;
for (var i = 0; i < data.length; i++) {
    var deviation = data[i] - mean;
    total += deviation * deviation;
}

var stddev = Math.sqrt(total / (data.length-1));


// 采取map + reduce
var sum = function(x,y) { 
    return x + y;
}
var square = function(x) { return x*x; }
//计算
var data = [1,1,3,5,5];
var mean = data.reduce(sum)/data.length;
var deviations = data.map(function(x) { return x - mean;});
var stddev = Math.sqrt(deviations.map(square).reduce(sum)/(data.length-1));

//todo:关于在ECMAScript 3如何实现这个呢？ 
//从书上获取-- 
var map = Array.prototype.map 
    ? function(a, f) { return a.map(f); }
    : function (a, f) {
        var result = [];
        for (var i = 0, len = a.length; i<len; i++) {
            result[i] = f.call(null, a[i], i, a);
        }
        return result;
    };
var reduce = Array.prototype.reduce 
    ? function(a, f, initial) { 
        if (arguments.length > 2) { 
            return a.reduce(f, initial);
        } else { 
            return a.reduce(f);
        }
    }
    : function(a, f, initial) {
        var i = 0, len = a.length, accumulator;

        //以特定的初始值开始，否则取第一个
        if (arguments.length > 2) {
            accumulator = initial;
        } else {
            //找到第一个已定义的索引
            if (len == 0) { 
                throw new TypeError();
            }
            while (i < len) { 
                if (i in a) { 
                    accumulator  = a[i];
                    break;
                }
                i++
            }
            if (i === len) { 
                throw new TypeError();
            }
        }

        while (i < len) { 
            if (i in len) { 
                accumulator = f.call(undefined, accumulator, a[i], i, a);
            }
            i++;
        }
        return accumulator;

    }
//完成了上面的代码， 后， 可以这么做
// 采取map + reduce
var sum = function(x,y) { 
    return x + y;
}
var square = function(x) { return x*x; }
//计算
var data = [1,1,3,5,5];
var mean = data.reduce(sum)/data.length;
var deviations = data.map(function(x) { return x - mean;});
var stddev = Math.sqrt(deviations.map(square).reduce(sum)/(data.length-1));


//高阶函数
//这里我们定义几个高阶的函数， 

//not
function not(f) { 
    return function() {
        var result = f.apply(this, arguments);
        return !result;
    }
}

var even = function(x) { 
    return x % 2 === 0;
}

var odd = not(even);
//验证
[1,1,3,5,5].every(odd);



//这里用一个contrived （不那么自然的方式） 
function mapper(f) { 
    return function(a) { return Array.prototype.map.call(a, f); }
}

var increment = function(x) { return x+1; }
var incrementer = mapper(increment);
incrementer([1,1,3,5,5]);

// 通过compose的方式来创建新的方法
//返回一个可以计算 h = f(g(...))的函数
function compose(f, g) {
    return function() { 
        return f.call(this, g.apply(this, arguments));
    };
}

//应用举例
var square = function(x) {
    return x * x ;
}
var sum = function(x, y) {
    return x + y;
}
var squareofsum = compose(square, sum);
squareofsum(2,3); // => 25


//不完全函数partialLeft
//
function array(a,n) { 
    return Array.prototype.slice.call(a, n || 0);
}

// 为什么需要从第一个参数开始， 原因是，第一个参数是f，也就是这个partial的函数
// 传递实参数至左侧
function partialLeft(f/*, */) {
    var args = arguments;
    return function() { 
        var a = array(args, 1);
        a = a.concat(array(arguments));
        return f.apply(this, a);
    }
}


// 传递实参数至右侧
function partialRight(f/*, */) {
    var args = arguments;
    return function() { 
        var a = array(arguments);
        a = a.concat(array(args, 1));
        return f.apply(this, a);
    }    
}


//如果中间的部分是undefined， 为什么是
function partial(f /*, ... */) {
    var args = arguments;
    return function() { 
        var a = array(args, 1);
        var i = 0, j = 0;
        for (; i < a.length; i++) { 
            //填充那些是0undefined的数据
            if (a[i] == undefined) {
                a[i] = arguments[j++];
            }
        }
        //现在添加的是
        a = a.concat(array(arguments, j));
        return f.apply(this, a);
    }
}

//这三个函数有三个实参数
var f = function(x, y, z) { 
    return x * (y - z);
}


partialLeft(f, 2)(3, 4);
partialRight(f, 2)(3, 4);
partial(f, undefined, 2)(3, 4);

//这个是用上面的partial函数构建新函数的例子
var increment = partialLeft(sum, 1);
var cuberroot = partialRight(Math.pow, 1/3);
String.prototype.first = partial(String.prototype.charAt, 0);
String.prototype.last = partial(String.prototype.substring, -1, 1);

// 用上面的例子做函数式编程
var not = partialLeft(compose, function(x) {return !x;});
var even = function(x) { return x %2 ===  0;};
var odd = not(even);
var isNumber = not(isNaN);

var data = [1,1,3,5,5];
var sum = function(x, y) { return x + y; };
var product = function(x, y) { return x * y; };
var neg = compose(product, -1);
var square = partial(Math.pow, undefined, 2);
var sqrt = partial(Math.pow, undefined, 0.5);
var reciprocal = partial(Math.pow, undefined, -1);

//用这个方式我们再来计算平均值和标准差
//这个方式和我们的
var mean = product(reduce(data, sum), reciprocal(data.length));
var stddev = sqrt(product(reduce(map(data, 
                                    compose(square, 
                                            partial(sum, neg(mean)))),
                                sum),
                        reciprocal(sum(data.length, -1))));


//记忆
//记忆是一个常用的手段， 用来调用函数， 并记忆之前调用结果的值
//返回 f()带来的记忆功能的版本
function memorize(f) { 
    var cache = {};
    return function() { 
        var args = Array.prototype.join.call(arguments,",");
        if (args in cache) { 
            return cache[args];
        } else { 
            result = f.apply(this, arguments);
            cache[args] = result;
            return result;
        }
    };
}

//这个是书上的吧版本
function memorize(f) { 
    var cache = {};

    return function() { 
        var key = arguments.length + Array.prototype.join.call(arguments, ",");
        if (key in cache) { 
            return cache[key];
        } else { 
            return cache[key] = f.apply(this, arguments);
        }
    };
}


//这里我们用一欧几里得公司来计算gcd
function gcd(a,b) {
    var t;
    if (a < b) { 
        t = a;
        a = b;
        b = t;
    }

    while (b != 0) { 
        t = b;
        b = a % b;
        a = t;
    }
    return a
    
}

var gcdmemo = memorize(gcd);
gcdmemo(85, 187);

//factorial 
var factorial = memorize(function(n)  { 
    return (n <= 1) ? 1 : 
        (n-1) * factorial(n-1);
});
factorial(5);