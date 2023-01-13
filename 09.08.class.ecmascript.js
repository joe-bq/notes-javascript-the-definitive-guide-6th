//这个方法，我们研究的是如何使用ecmascript5 的特性
//ecmascript5 给方法添加的方法属性主要是包含了 getter, setter, configurable, writable

//不可枚举

//定义一个不可枚举的类型
//09.17.objectid.js
//通过它， 在每一个对象上定义了一个objectid, 
//它不可枚举，它通过一个只读的getter去获取到他的值
//他的访问器中使用了一个|**objectId**| 作为实例的读写存储器

//使用代码如下
var s = new String("new String");
s.objectId
s['|**objectId**|']


// 目标： sealed class， 等同于 java 的final class
//参考  09.18.range4
//它使用的是defineProperites等emcascript的define properties的方法


//=====
// This function works with or without 'new': a constructor and factory function
function Range(from,to) {
    // These are descriptors for the read-only from and to properties.
    var props = {
        from: {value:from, enumerable:true, writable:false, configurable:false},
        to: {value:to, enumerable:true, writable:false, configurable:false}
    };
    
    if (this instanceof Range)                // If invoked as a constructor
        Object.defineProperties(this, props); // Define the properties
    else                                      // Otherwise, as a factory 
        return Object.create(Range.prototype, // Create and return a new
                             props);          // Range object with props
}

// If we add properties to the Range.prototype object in the same way,
// then we can set attributes on those properties.  Since we don't specify
// enumerable, writable, or configurable, they all default to false.
Object.defineProperties(Range.prototype, {
    includes: {
        value: function(x) { return this.from <= x && x <= this.to; }
    },
    foreach: {
        value: function(f) {
            for(var x = Math.ceil(this.from); x <= this.to; x++) f(x);
        }
    },
    toString: {
        value: function() { return "(" + this.from + "..." + this.to + ")"; }
    }
});

//===


// 另外一个对于 emcascripts 的freeze的方法
// 09.19.freezeProps.js



//=====
// Make the named (or all) properties of o nonwritable and nonconfigurable.
function freezeProps(o) {
    var props = (arguments.length == 1)              // If 1 arg
        ? Object.getOwnPropertyNames(o)              //  use all props
        : Array.prototype.splice.call(arguments, 1); //  else named props
    props.forEach(function(n) { // Make each one read-only and permanent
        // Ignore nonconfigurable properties
        if (!Object.getOwnPropertyDescriptor(o,n).configurable) return;
        Object.defineProperty(o, n, { writable: false, configurable: false });
    });
    return o;  // So we can keep using it
}

// Make the named (or all) properties of o nonenumerable, if configurable.
function hideProps(o) {
    var props = (arguments.length == 1)              // If 1 arg
        ? Object.getOwnPropertyNames(o)              //  use all props
        : Array.prototype.splice.call(arguments, 1); //  else named props
    props.forEach(function(n) { // Hide each one from the for/in loop
        // Ignore nonconfigurable properties
        if (!Object.getOwnPropertyDescriptor(o,n).configurable) return;
        Object.defineProperty(o, n, { enumerable: false });
    });
    return o;
}

//===

//上面的代码,
//
// 
var r1 = new Range(5,10);
console.log(r1.from + "," + r1.to);


//通过这个freezeProperties的函数，我们可以对之前的Range的优化 ，不用做动态的修改这个类
// 09.20.range5.js
//===
function Range(from, to) {    // Constructor for an immutable Range class
    this.from = from;
    this.to = to;
    freezeProps(this);        // Make the properties immutable
}

Range.prototype = hideProps({ // Define prototype with nonenumerable properties
    constructor: Range,
    includes: function(x) { return this.from <= x && x <= this.to; },
    foreach: function(f) {for(var x=Math.ceil(this.from);x<=this.to;x++) f(x);},
    toString: function() { return "(" + this.from + "..." + this.to + ")"; }
});

//==

//下面的代码， 定义的是如何封装用户的状态
// java sealed class with private fields - getter/setter 替代public fields
//上面的方法是通过对变量封装的方式隐藏
//9.6.6节 的方法 9-10的实现使用的是存储器
//


//====
// This version of the Range class is mutable but encapsulates its endpoint
// variables to maintain the invariant that from <= to.
function Range(from, to) {
    // Verify that the invariant holds when we're created
    if (from > to) throw new Error("Range: from must be <= to");

    // Define the accessor methods that maintain the invariant
    function getFrom() {  return from; }
    function getTo() {  return to; }
    function setFrom(f) {  // Don't allow from to be set > to
        if (f <= to) from = f;
        else throw new Error("Range: from must be <= to");
    }
    function setTo(t) {    // Don't allow to to be set < from
        if (t >= from) to = t;
        else throw new Error("Range: to must be >= from");
    }

    // Create enumerable, nonconfigurable properties that use the accessors
    Object.defineProperties(this, {
        from: {get: getFrom, set: setFrom, enumerable:true, configurable:false},
        to: { get: getTo, set: setTo, enumerable:true, configurable:false }
    });
}

// The prototype object is unchanged from previous examples.
// The instance methods read from and to as if they were ordinary properties.
Range.prototype = hideProps({
    constructor: Range,
    includes: function(x) { return this.from <= x && x <= this.to; },
    foreach: function(f) {for(var x=Math.ceil(this.from);x<=this.to;x++) f(x);},
    toString: function() { return "(" + this.from + "..." + this.to + ")"; }
});


//======


var r3 = new Range(20, 40);
//你不能修改 getFrom(), getTo()
//不会报错，但是不会改变Range好的功能
Range.getFrom = function() { throw new Error ("I'm evil"); }
r3.includes(10);


//防止类的扩展
//javascrip的所有的方法等都可以扩展
//之前是无法对此限制，ECMAScript 添加了新的方法
// - 利用下面的方法可以做到prototype不能被扩展
Object.seal(Object.prototype);


var original_sort_method = Array.prototype.sort;

Array.prototype.sort = function() {
    var start = new Date();
    original_sort_method.apply(this, arguments);
    var end = new Date();
    console.log("Array sort took " + (end - start) + " milliseconds ");
};

[1,1,3,5,5].sort();
// 输出的值是 Array sort took 0 milli-seconds

// 什么情况下可以使用到限制对对象限制这个能力呢？ 
// 一般的说enumeration 可以添加 Object.freeze();

//=====

// This function creates a new enumerated type.  The argument object specifies
// the names and values of each instance of the class. The return value
// is a constructor function that identifies the new class.  Note, however
// that the constructor throws an exception: you can't use it to create new
// instances of the type.  The returned constructor has properties that 
// map the name of a value to the value itself, and also a values array,
// a foreach() iterator function
function enumeration(namesToValues) {
    // This is the dummy constructor function that will be the return value.
    var enumeration = function() { throw "Can't Instantiate Enumerations"; };

    // Enumerated values inherit from this object.
    var proto = enumeration.prototype = {
        constructor: enumeration,                   // Identify type
        toString: function() { return this.name; }, // Return name
        valueOf: function() { return this.value; }, // Return value
        toJSON: function() { return this.name; }    // For serialization
    };

    enumeration.values = [];  // An array of the enumerated value objects

    // Now create the instances of this new type.
    for(name in namesToValues) {         // For each value 
        var e = inherit(proto);          // Create an object to represent it
        e.name = name;                   // Give it a name
        e.value = namesToValues[name];   // And a value
        enumeration[name] = e;           // Make it a property of constructor
        enumeration.values.push(e);      // And store in the values array
    }
    // A class method for iterating the instances of the class
    enumeration.foreach = function(f,c) {
        for(var i = 0; i < this.values.length; i++) f.call(c,this.values[i]);
    };

    // Return the constructor that identifies the new type
    return enumeration;
}


//=====
Object.freeze(enumeration.values);
Object.freeze(enumeration);


//下面的方法的主要特点是使用了
//StringSet 采取了 Object.create(null) 创建的运行对象
// 参考 09.16
// 下面的方法需要如下的
// 08.03.extend_patched.js -- extend
// 06.01.inherit.js - inherits
// 09.16.Sets.js - Sets and abstractWritaleSets
// 


//======
function StringSet() {
    this.set = Object.create(null);  // Create object with no proto
    this.n = 0;
    this.add.apply(this, arguments);
}

// Note that with Object.create we can inherit from the superclass prototype
// and define methods in a single call. Since we don't specify any of the
// writable, enumerable, and configurable properties, they all default to false.
// Readonly methods makes this class trickier to subclass.
StringSet.prototype = Object.create(AbstractWritableSet.prototype, {
    constructor: { value: StringSet },
    contains: { value: function(x) { return x in this.set; } },
    size: { value: function(x) { return this.n; } },
    foreach: { value: function(f,c) { Object.keys(this.set).forEach(f,c); } },
    add: {
        value: function() {
            for(var i = 0; i < arguments.length; i++) {
                if (!(arguments[i] in this.set)) {
                    this.set[arguments[i]] = true;
                    this.n++;
                }
            }
            return this;
        } 
    },
    remove: {
        value: function() {
            for(var i = 0; i < arguments.length; i++) {
                if (arguments[i] in this.set) {
                    delete this.set[arguments[i]];
                    this.n--;
                }
            }
            return this;
        } 
    }
});


//=======

//属性描述符
//Object.properties()
// 这个方法用来返回属性的名字
//并提供方法用例操作属性， - 比如说hide / show

//==== 
/*
 * Define a properties() method in Object.prototype that returns an
 * object representing the named properties of the object on which it
 * is invoked (or representing all own properties of the object, if
 * invoked with no arguments).  The returned object defines four useful 
 * methods: toString(), descriptors(), hide(), and show().
 */
(function namespace() {  // Wrap everything in a private function scope

    // This is the function that becomes a method of all object
    function properties() {
        var names;  // An array of property names
        if (arguments.length == 0)  // All own properties of this
            names = Object.getOwnPropertyNames(this);
        else if (arguments.length == 1 && Array.isArray(arguments[0]))
            names = arguments[0];   // Or an array of names
        else                        // Or the names in the argument list
            names = Array.prototype.splice.call(arguments, 0);

        // Return a new Properties object representing the named properties
        return new Properties(this, names);
    }

    // Make it a new nonenumerable property of Object.prototype.
    // This is the only value exported from this private function scope.
    Object.defineProperty(Object.prototype, "properties", {
        value: properties,  
        enumerable: false, writable: true, configurable: true
    });

    // This constructor function is invoked by the properties() function above.
    // The Properties class represents a set of properties of an object.
    function Properties(o, names) {
        this.o = o;            // The object that the properties belong to
        this.names = names;    // The names of the properties
    }
    
    // Make the properties represented by this object nonenumerable
    Properties.prototype.hide = function() {
        var o = this.o, hidden = { enumerable: false };
        this.names.forEach(function(n) {
                               if (o.hasOwnProperty(n))
                                   Object.defineProperty(o, n, hidden);
                           });
        return this;
    };

    // Make these properties read-only and nonconfigurable
    Properties.prototype.freeze = function() {
        var o = this.o, frozen = { writable: false, configurable: false };
        this.names.forEach(function(n) {
                               if (o.hasOwnProperty(n))
                                   Object.defineProperty(o, n, frozen);
                           });
        return this;
    };

    // Return an object that maps names to descriptors for these properties.
    // Use this to copy properties along with their attributes:
    //   Object.defineProperties(dest, src.properties().descriptors());
    Properties.prototype.descriptors = function() {
        var o = this.o, desc = {};
        this.names.forEach(function(n) {
                               if (!o.hasOwnProperty(n)) return;
                               desc[n] = Object.getOwnPropertyDescriptor(o,n);
                           });
        return desc;
    };

    // Return a nicely formatted list of properties, listing the 
    // name, value and attributes. Uses the term "permanent" to mean
    // nonconfigurable, "readonly" to mean nonwritable, and "hidden"
    // to mean nonenumerable. Regular enumerable, writable, configurable 
    // properties have no attributes listed.
    Properties.prototype.toString = function() {
        var o = this.o; // Used in the nested function below
        var lines = this.names.map(nameToString);
        return "{\n  " + lines.join(",\n  ") + "\n}";
        
        function nameToString(n) {
            var s = "", desc = Object.getOwnPropertyDescriptor(o, n);
            if (!desc) return "nonexistent " + n + ": undefined";
            if (!desc.configurable) s += "permanent ";
            if ((desc.get && !desc.set) || !desc.writable) s += "readonly ";
            if (!desc.enumerable) s += "hidden ";
            if (desc.get || desc.set) s += "accessor " + n
            else s += n + ": " + ((typeof desc.value==="function")?"function"
                                                                  :desc.value);
            return s;
        }
    };

    // Finally, make the instance methods of the prototype object above 
    // nonenumerable, using the methods we've defined here.
    Properties.prototype.properties().hide();
}()); // Invoke the enclosing function as soon as we're done defining it.

//===
var o = {x:1,y:2};
var props = o.properties();




//模块 
//模块是我们开发一些带有嵌套的的包，做结构的管理
//
var sets = {};
sets.SingletonSet = sets.AbstractWritableSet.extend(/*...*/);

//或者是通过如下的方式来创建构造函数 
var s = new sets.SingletonSet(1);


//你可以对上面的在namespace的函数来定义一个别名 
var Set = sets.Set;
var s = new Set(1,2,3);


//如果说我们希望做一些更深层次的嵌套，需要如下的做 
var collections; // 申明 
if (!collections) {
    collections = {};
}

collections.sets = {};

// 接着我们在Collections.sets内定义sets类
collections.sets.AbstractSet = function() { /*... */ }
//如何把整个包倒入
//例子如下 
var sets = cam.davidflagan.collections.sets;




//下面展示的是作为私有命名空间的函数
//
//定义一个空的匿名的空间，作为一个namespace来使用


//=====
// Declare a global variable Set and assign it the return value of this function
// The open parenthesis and the function name below hint that the function 
// will be invoked immediately after being defined, and that it is the function
// return value, not the function itself, that is being assigned.
// Note that this is a function expression, not a statement, so the name
// "invocation" does not create a global variable.
var Set = (function invocation() {
   
    function Set() {  // This constructor function is a local variable.
        this.values = {};     // The properties of this object hold the set
        this.n = 0;           // How many values are in the set
        this.add.apply(this, arguments);  // All arguments are values to add
    }

    // Now define instance methods on Set.prototype.
    // For brevity, code has been omitted here
    Set.prototype.contains = function(value) {
        // Note that we call v2s(), not the heavily prefixed Set._v2s()
        return this.values.hasOwnProperty(v2s(value));
    };
    Set.prototype.size = function() { return this.n; };
    Set.prototype.add = function() { /* ... */ };
    Set.prototype.remove = function() { /* ... */ };
    Set.prototype.foreach = function(f, context) { /* ... */ };

    // These are helper functions and variables used by the methods above
    // They're not part of the public API of the module, but they're hidden
    // within this function scope so we don't have to define them as a 
    // property of Set or prefix them with underscores.
    function v2s(val) { /* ... */ }
    function objectId(o) { /* ... */ }
    var nextId = 1;

    // The public API for this module is the Set() constructor function.
    // We need to export that function from this private namespace so that
    // it can be used on the outside.  In this case, we export the constructor
    // by returning it.  It becomes the value of the assignment expression
    // on the first line above.
    return Set;
}()); // Invoke the function immediately after defining it.

//===

var collections;

if (!collections) collections = {};

collections.sets = (function namespace() {
    //在这里定义很多的集合类，使用局部变量和函数


    // 通过返回命名空间的对象将 API导出 

    return {
        //导出的属性名： 局部变量的名字
        AbstractSet: AbstractSet,
        NotSet: NotSet,
        AbstractEnumerableSet: AbstractEnumerableSet,
        SingletonSet: SingletonSet,
        AbstractWritableSet: AbstractEnumerableSet,
        ArraySet: ArraySet
    };
}());


//另外一种方式是通过模块函数的this 通过new来调用

var collections;

if (!collections) {
    collections = {};
}


collections.sets = (new function namespace() {
    //在这里定义很多的集合类，使用局部变量和函数

    // 通过返回命名空间的对象将 API导出 
    this.AbstractSet = AbstractSet,
    this.NotSet = NotSet,
    this.AbstractEnumerableSet = AbstractEnumerableSet,
    this.SingletonSet = SingletonSet,
    this.AbstractWritableSet = AbstractEnumerableSet,
    this.ArraySet = ArraySet
}());


//还有其他的方式 
//

var collections ;
if (!collections) { 
    collections = {};
}

collections.sets = {};

(function namespace() {
    //在这里定义很多的集合类，使用局部变量和函数

    // 通过返回命名空间的对象将 API导出 
    collections.sets.AbstractSet = AbstractSet;
    collections.sets.NotSet = NotSet;
    collections.sets.AbstractEnumerableSet = AbstractEnumerableSet;
    collections.sets.SingletonSet = SingletonSet;
    collections.sets.AbstractWritableSet = AbstractEnumerableSet;
    collections.sets.ArraySet = ArraySet;
}());