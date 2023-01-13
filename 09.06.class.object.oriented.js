//这里说明的是， 
//面向对象的技术， 这里用代码介绍了， Set等常用集合类的实现





//09.06.Set1.js

//集合类的实现
// 参考这里的实现
//09.07.enumeration.js

//枚举类的使用的例子
//enumeration可以认为是一个类型的工厂类型
var Coin = enumeration({Penny: 1, Nickel: 2, Dime: 10, Quarter: 25});
var c = Coin.Dime;
c instanceof Coin;

c.constructor == Coin;

//这里比较特殊， 将值转化为数字， 是不是原因为valueOf的值
Coin.Quarter + 3 * Coin.Nickel;

Coin.Dime == 10;
Coin.Dime > Coin.Nickel;

String(Coin.Dime) + ":" + Coin.Dime;//强制转化为String


//另外一个例子， 使用的是enumeration创建一个纸牌例子
//
// 如下的几个方法
// valueOf
// toString()
// toJSON()



//对Set.prototype添加方法
extend(Set.prototype, {
    toString: function() { 
        var s = "{",
            i = 0;
        //还有一种写法是如下 可能是新的ECMAScript的写法
        this.foreach(v => {
            s += ((i++) > 0) ? "," : "";
            s += v;
        });
        //上面的写法也是对的
        //this.foreach(function(v){ s+= ((i++ > 0) ? "," : ""); s += v; });
        return s + "}";
    },
    toLocalString: function() { 
        var s = "{",
            i = 0;
        this.foreach(function(v) { 
            s += ((i++) > 0) ? "," : "";
            if (v == null) { 
                s += v;
            } else {
                s += v.toLocalString();
            }
        });
        return s + "}";
    },
    toArray: function() { 
        var a = [];
        this.foreach(function(v) { 
            a.push(v);
        });
        return a;
    }
});

Set.prototype.toJSON = Set.prototype.toArray;



//这个比较方法
//主要是用在比如  a > b 这样的判断中
//另外还有一种比较， 是通过equals比较


//例子似乎通过对range的对比实现
//构造函数patch
Range.prototype.constructor = Range;

//
Range.prototype.equals = function(other) { 
    if (other == null) {
        return false;
    }
    //这个方法，typeof只会返回 function, 或者是object
    //你可以使用 class, 或者是prototype.constructor
    // if (typeof other != Range) {
    //     return false;
    // }

    if (other.constructor !== Range) {
        return false;
    }

    return this.from == other.from && this.to == other.to;
}

//这里再说明一下如何实现Set的equals的实现
Set.prototype.equals = function(that) { 
    if (this === that) { 
        return true;
    }
    //如果类型不一致， 返回
    if (! (that instanceof Set)) {
        return false;
    }

    //如果set的大小不一样
    if (this.size() != that.size()) {
        return false;
    }
    //判断是否可以做到相互包含
    //这个地方说明， javascript的控制有多随意
    try {
        this.foreach(function(v) { 
            if (!that.contains(v)) {
                throw false;
            } 
         });
    } catch (x) {
        if (x === false) {
            return false;
        }
        throw x; //?为什么不直接返回false？
    }
    return true;
};

var s1 = new Set() ;
s1.add("JOE");
s1.add("NORA");


var s2 = new Set() ;
s2.add("JOE");
s2.add("NORA");

var s3 = new Set() ;
s3.add("KEVIN");
s3.add("NORA");


//这里我门再实现一个关于这个Range的比较的对象
Range.prototype.compareTo = function(that) { 
    //抛异常是正确的做法
    if (!(that instanceof Range) ) {
        throw new Error("Cannot compare a Range with " + that);
    }

    //查找到他们的区别
    var diff = this.from - that.from;
    if (diff == 0) { 
        diff = this.to - that.to;
    }
    return diff;
};

//有了这个方法
//
var ranges = [];
ranges.push(new Range(1, 2));
ranges.push(new Range(2, 3));
ranges.sort(function(a,b) { return a.compareTo(b)});

//一般我们会把这个比较的方法写到类的static方法里面

Range.byLowerBound = function(a,b) { 
    return a.compareTo(b);
};
ranges.sort(Range.byLowerBound);

//关于方法调用， 你可以参考这里的实现
//09.09.genericmethods.js

//我们定义了泛型的方法以后， 可以通过下面的方式来借用
Range.prototype.equals = generic.equals;


//9.6.6. 私有状态
//这一章主要是讲，如果需要隐藏，比如说range.to, range.from等的值， 如何做到？
//对比之前

// function Range(from, to) {
//     this.from = from;
//     this.to = to;
// }

function Range(from, to) {
    // 通过闭包
    this.from = function() { 
        return from;
    }
    this.to = function() { 
        return to;
    }
}

//这么修改以后， 那么Range的原型方法必须修改
Range.prototype = {
    constructor: Range,
    includes: function(x) { 
        return x >= this.from() && x <= this.to();
    },
    foreach: function(f) {
        for (var x = Math.ceil(this.from()), max = this.to(); x <= max; x++) {
            f(x);
        }
    },
    toString: function() { 
        return "(" + this.from() + "..." + this.to() + ")";
    }
};


//9.6.7 这里再说一下构造函数的重载和工厂方法
//我们一般使用的new 的方法构造的函数
//这个是一般的Set的构造函数, 他不支持多个第一个参数是数组的类型
// function Set() {          // This is the constructor
//     this.values = {};     // The properties of this object hold the set
//     this.n = 0;           // How many values are in the set
//     this.add.apply(this, arguments);  // All arguments are values to add
// }

function Set() {
    this.values = {};     // The properties of this object hold the set
    this.n = 0;           // How many values are in the set
    
    //
    if (arguments.length == 1 && isArrayLike(arguments[0])) {
        this.add.apply(this, arguments[0]);
    } else if (arguments.length > 0) {
        this.add.apply(this, arguments);
    }
}


//同理， 我们可以构造一些类方法来做工厂方法
Complex.polar = function(r, theta) { 
    return new Complex(r * Math.cos(theta), r * Math.sin(theta));
};

//工厂方法例子二
Set.fromArray = function(a) { 
    s = new Set();
    s.add.apply(s, a);
    return s;
};

//有点像typealias或者 说是子类， 他们共享同一个prototype
//我们在9.7马上会学到子类
function SetFromArray(a) { 
    Set.apply(this, a);
}
SetFromArray.prototype = Set.prototype;
var s = new SetFromArray([1,2,3]);
s instanceof Set;