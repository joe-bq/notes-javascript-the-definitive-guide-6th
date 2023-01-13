//class and prototype

//判断是否一个对象是不是另一个类的对象， 有一个方法

o instanceof Range
//实际上计算的是对象的prototype值
//instanceof类型
range.methods.isPrototypeOf(r);

//他们的(instanceor, isPrototypeOf)的局限是， 他们只能检查， 不能判断是否..

//constructor属性
//construcotr属性，实际上是继承于prototype.constructor属性
function typeAndValue(x) { 
    if (x === null) { 
        return "";
    }

    switch (x.constructor) {
        case Number: {
            return "Mumber: " + x;
        }
        case String: { 
            return "String: " + x;
        }
        case Date: {
            return "Date: " + x;
        }
        case RegExp: { 
            return "Regex: " + x;
        }
        case Complex: { 
            return "Complex: " + x;
        }
    }
}

//这里要说明的是， instrance和constructor属性检查的时候， 可能会出错， 原因，他们在多个执行上下文中存在构造函数的多个副本的时候
//这两个方法的检测结果会出错
//查看 09.04.type 这里的说明
//我们这里直接拷贝过来

/**
 * Return the type of o as a string:
 *   -If o is null, return "null", if o is NaN, return "nan".
 *   -If typeof returns a value other than "object" return that value.
 *    (Note that some implementations identify regexps as functions.)
 *   -If the class of o is anything other than "Object", return that.
 *   -If o has a constructor and that constructor has a name, return it.
 *   -Otherwise, just return "Object".
 **/
 function type(o) {
    var t, c, n;  // type, class, name

    // Special case for the null value:
    if (o === null) return "null";

    // Another special case: NaN is the only value not equal to itself:
    if (o !== o) return "nan";

    // Use typeof for any value other than "object".
    // This identifies any primitive value and also functions.
    if ((t = typeof o) !== "object") return t;

    // Return the class of the object unless it is "Object".
    // This will identify most native objects.
    if ((c = classof(o)) !== "Object") return c;

    // Return the object's constructor name, if it has one
    if (o.constructor && typeof o.constructor === "function" &&
        (n = o.constructor.getName())) return n;

    // We can't determine a more specific type, so return "Object"
    return "Object";
}

// Return the class of an object.
function classof(o) {
    return Object.prototype.toString.call(o).slice(8,-1);
};
    
// Return the name of a function (may be "") or null for nonfunctions
Function.prototype.getName = function() {
    if ("name" in this) return this.name;
    return this.name = this.toString().match(/function\s*([^(]*)\(/)[1];
};


//上面的例子， 我们看几个函数是否可以
//这个函数没有名字
var Complex = function(x, y) { this.r = x; this.i = y;}
var Range = function Range(f, t) { this.from = f; this.to = t; }


type(Complex);
type(Range);



//下面这里我们使用鸭式辩解的说明
//拷贝自  09.05.quacks.js
// Return true if o implements the methods specified by the remaining args.
function quacks(o /*, ... */) {
    for(var i = 1; i < arguments.length; i++) {  // for each argument after o
        var arg = arguments[i];
        switch(typeof arg) { // If arg is a:
        case 'string':       // string: check for a method with that name
            if (typeof o[arg] !== "function") return false;
            continue;
        case 'function':     // function: use the prototype object instead
            // If the argument is a function, we use its prototype object
            arg = arg.prototype;
            // fall through to the next case
        case 'object':       // object: check for matching methods
            for(var m in arg) { // For each property of the object
                if (typeof arg[m] !== "function") continue; // skip non-methods
                if (typeof o[m] !== "function") return false;
            }
        }
    }
    
    // If we're still here, then o implements everything
    return true;
}

