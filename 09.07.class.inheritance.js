//这里主要讲的是继承相关的信息
B.prototype = inherit(A.prototype);
B.prototype.constructor = B;



//对上面的方法做一个改造， 那么， 我们定义defineClass的方法应该如下


//这里也搬运了inherits
//06.01.inherit.js
// inherit() returns a newly created object that inherits properties from the
// prototype object p.  It uses the ECMAScript 5 function Object.create() if
// it is defined, and otherwise falls back to an older technique.
function inherit(p) {
    if (p == null) throw TypeError(); // p must be a non-null object
    if (Object.create)                // If Object.create() is defined...
        return Object.create(p);      //    then just use it.
    var t = typeof p;                 // Otherwise do some more type checking
    if (t !== "object" && t !== "function") throw TypeError();
    function f() {};                  // Define a dummy constructor function.
    f.prototype = p;                  // Set its prototype property to p.
    return new f();                   // Use f() to create an "heir" of p.
}




//继续搬运了 extend.js 方法
// Define an extend function that copies the properties of its second and 
// subsequent arguments onto its first argument.
// We work around an IE bug here: in many versions of IE, the for/in loop
// won't enumerate an enumerable property of o if the prototype of o has 
// a nonenumerable property by the same name. This means that properties
// like toString are not handled correctly unless we explicitly check for them.
var extend = (function() {  // Assign the return value of this function 
    // First check for the presence of the bug before patching it.
    for(var p in {toString:null}) {
        // If we get here, then the for/in loop works correctly and we return
        // a simple version of the extend() function
        return function extend(o) {
            for(var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for(var prop in source) o[prop] = source[prop];
            }
            return o;
        };
    }
    // If we get here, it means that the for/in loop did not enumerate
    // the toString property of the test object. So return a version
    // of the extend() function that explicitly tests for the nonenumerable
    // properties of Object.prototype.
    return function patched_extend(o) {
        for(var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            // Copy all the enumerable properties
            for(var prop in source) o[prop] = source[prop];

            // And now check the special-case properties
            for(var j = 0; j < protoprops.length; j++) {
                prop = protoprops[j];
                if (source.hasOwnProperty(prop)) o[prop] = source[prop];
            }
        }
        return o;
    };

    // This is the list of special-case properties we check for
    var protoprops = ["toString", "valueOf", "constructor", "hasOwnProperty",
                      "isPrototypeOf", "propertyIsEnumerable","toLocaleString"];
}());


//09.11.defineSubclass.js
// A simple function for creating simple subclasses
function defineSubclass(superclass,  // Constructor of the superclass
                        constructor, // The constructor for the new subclass
                        methods,     // Instance methods: copied to prototype
                        statics)     // Class properties: copied to constructor
{
    // Set up the prototype object of the subclass
    constructor.prototype = inherit(superclass.prototype);
    constructor.prototype.constructor = constructor;
    // Copy the methods and statics as we would for a regular class
    if (methods) extend(constructor.prototype, methods);
    if (statics) extend(constructor, statics);
    // Return the class
    return constructor;
}

// We can also do this as a method of the superclass constructor
Function.prototype.extend = function(constructor, methods, statics) {
    return defineSubclass(this, constructor, methods, statics);
};

//例子可以SingletonSet的实现
//代码可以参考：
//09.12.SingletonSet.js


var s1 = new SingletonSet("JOE");
var s2 = new SingletonSet("JOE");

//为什么需要重写equals, 原因， 子类的类型变化， 
//我们还需要调用父类的equals方法??
// Set.prototype.equals 检查了类型的对象的类型为Set, 所以这个调用， 会失败， 我们会找其他的方式来验证是否是equals
//Set.prototype.equals的实现， 可看 09.06.class.object.oriented.js
SingletonSet.prototype.equals = function(that) {
    return (that instanceof SingletonSet) && Set.prototype.equals.apply(this, that);
}
//当然， 也可以通过直接编写比较函数的方式实现
SingletonSet.prototype.equals = function(that) {
    return (that instanceof SingletonSet) && that.size() == 1 && that.contains(this.member);
}

//我们继续看这个子类调用父类的构造函数和方法
//09.13.NonNullSet.js
//不允许构造一个带有null或者是undefined的Set类


//父类的方法 
//09.14.filteredSetSubclass.js
//我们再接着看这个只能保存字符串的“集合”的类
var StringSet = filteredSetSubclass(Set, function(x) { return typeof x === "string";});
var MySet = filteredSetSubclass(NonNullSet, function(x) { return typeof x !== "function";});

//验证
var strset = new StringSet() ;
strset.add("JOE");
strset.add(1);

//类工厂的能力
var NonNullSet = (function() { 
    var superclass = Set; 
    return superclass.extend(function() { 
        superclass.apply(this, arguments);
    },
    {
        add: function() { 
             // Check for null or undefined arguments
            for(var i = 0; i < arguments.length; i++)
            if (arguments[i] == null)
                throw new Error("Can't add null or undefined to a NonNullSet");

            // Chain to the superclass to perform the actual insertion
            return superclass.prototype.add.apply(this, arguments);
        }
    })
} ());


//我们再创建一个子对象的实例，验证上面的代码
var nonnullset = new NonNullSet();
nonnullset.add("JOE");
nonnullset.add(null); //这里会报错


//组合 vs 子类

//我们在
//09.12.SingletonSet.js
//09.13.NonNullSet.js
//使用的是定一个子类的方式
//但是通过组合的方式， “组合优于继承"
//参考 代码的实现 
// 09.15.FilteredSet.js

//使用例子可以参考如下
var s = new FilteredSet(new Set(), function(x) { return x != null;});

//甚至还可以对过滤后的集合再过滤
var t = new FilteredSet(s, { function(x) { return !(x instanceof Set);}});



//上面的方法实际上是创建的实例实际上的实例是父类（Set）
//我们接下来需要看的是这个用的抽象类（在其他语言中）叫做接口的方式写的代码

//抽象方法
function abstractmethod() {
    throw new Error("abstract method");
}

//抽象类
function AbstractSet() {
    throw new Error("Can't instantiate abstract method");
}

//抽象类中的抽象方法
AbstractSet.prototype.contains = abstractmethod;

/*
 * NotSet is a concrete subclass of AbstractSet.
 * The members of this set are all values that are not members of some
 * other set. Because it is defined in terms of another set it is not
 * writable, and because it has infinite members, it is not enumerable.
 * All we can do with it is test for membership.
 * Note that we're using the Function.prototype.extend() method we defined
 * earlier to define this subclass.
 */
var NotSet = AbstractSet.extend(function NotSet(set) { 
    this.set = set;
}, 
{
    contains: function(x) { this.set.contains(x); },
    toString: function(x) {return "~" + this.set.toString() },
    equals: function(that) { 
        return that instanceof NotSet && this.set.contains(that.set);
    }
}
);


//我们再看其他的实现， 这个代码为了方便，我是直接copy过来了
//源代码在 09.16.Sets.js
/*
 * AbstractEnumerableSet is an abstract subclass of AbstractSet.
 * It defines the abstract methods size() and foreach(), and then implements
 * concrete isEmpty(), toArray(), to[Locale]String(), and equals() methods
 * on top of those. Subclasses that implement contains(), size(), and foreach() 
 * get these five concrete methods for free.
 */
var AbstractEnumerableSet = AbstractSet.extend(
    function() { throw new Error("Can't instantiate abstract classes"); }, 
    {
        size: abstractmethod,
        foreach: abstractmethod,
        isEmpty: function() { return this.size() == 0; },
        toString: function() {
            var s = "{", i = 0;
            this.foreach(function(v) {
                             if (i++ > 0) s += ", ";
                             s += v;
                         });
            return s + "}";
        },
        toLocaleString : function() {
            var s = "{", i = 0;
            this.foreach(function(v) {
                             if (i++ > 0) s += ", ";
                             if (v == null) s += v; // null & undefined
                             else s += v.toLocaleString(); // all others
                         });
            return s + "}";
        },
        toArray: function() {
            var a = [];
            this.foreach(function(v) { a.push(v); });
            return a;
        },
        equals: function(that) {
            if (!(that instanceof AbstractEnumerableSet)) return false;
            // If they don't have the same size, they're not equal
            if (this.size() != that.size()) return false;
            // Now check whether every element in this is also in that.
            try {
                this.foreach(function(v) {if (!that.contains(v)) throw false;});
                return true;  // All elements matched: sets are equal.
            } catch (x) {
                if (x === false) return false; // Sets are not equal
                throw x; // Some other exception occurred: rethrow it.
            }
        }
    });

/*
 * SingletonSet is a concrete subclass of AbstractEnumerableSet.
 * A singleton set is a read-only set with a single member.
 */
var SingletonSet = AbstractEnumerableSet.extend(
    function SingletonSet(member) { this.member = member; },
    {
        contains: function(x) {  return x === this.member; },
        size: function() { return 1; },
        foreach: function(f,ctx) { f.call(ctx, this.member); }
    }
);


/*
 * AbstractWritableSet is an abstract subclass of AbstractEnumerableSet.
 * It defines the abstract methods add() and remove(), and then implements
 * concrete union(), intersection(), and difference() methods on top of them.
 */
var AbstractWritableSet = AbstractEnumerableSet.extend(
    function() { throw new Error("Can't instantiate abstract classes"); }, 
    {
        add: abstractmethod,
        remove: abstractmethod,
        union: function(that) {
            var self = this;
            that.foreach(function(v) { self.add(v); });
            return this;
        },
        intersection: function(that) {
            var self = this;
            this.foreach(function(v) { if (!that.contains(v)) self.remove(v);});
            return this;
        },
        difference: function(that) {
            var self = this;
            that.foreach(function(v) { self.remove(v); });
            return this;
        }
    });

/*
 * An ArraySet is a concrete subclass of AbstractWritableSet.
 * It represents the set elements as an array of values, and uses a linear
 * search of the array for its contains() method. Because the contains()
 * method is O(n) rather than O(1), it should only be used for relatively
 * small sets. Note that this implementation relies on the ES5 Array methods
 * indexOf() and forEach().
 */
var ArraySet = AbstractWritableSet.extend(
    function ArraySet() {
        this.values = [];
        this.add.apply(this, arguments);
    },
    {
        contains: function(v) { return this.values.indexOf(v) != -1; },
        size: function() { return this.values.length; },
        foreach: function(f,c) { this.values.forEach(f, c); },
        add: function() { 
            for(var i = 0; i < arguments.length; i++) {
                var arg = arguments[i];
                if (!this.contains(arg)) this.values.push(arg);
            }
            return this;
        },
        remove: function() {
            for(var i = 0; i < arguments.length; i++) {
                var p = this.values.indexOf(arguments[i]);
                if (p == -1) continue;
                this.values.splice(p, 1);
            }
            return this;
        }
    }
);
