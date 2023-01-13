//constructor class
var F = function() { 
};

//这里关于constructor ， prototype和 关系 
var p = F.prototype;
var c = p.constructor;
c === F;

//对于这个的补救的措施就是


// 09.02.range2.js - 存在的问题， 没有使用预定义的原型对象
//这里介绍了一个补救的方案
// All Range objects inherit from this object.
// Note that the property name must be "prototype" for this to work.
Range.prototype = {
    //关键是这里设置的反向依赖,
    constructor: Range,
    // Return true if x is in the range, false otherwise
    // This method works for textual and Date ranges as well as numeric.
    includes: function(x) { return this.from <= x && x <= this.to; },
    // Invoke f once for each integer in the range.
    // This method works only for numeric ranges.
    foreach: function(f) {
        for(var x = Math.ceil(this.from); x <= this.to; x++) f(x);
    },
    // Return a string representation of the range
    toString: function() { return "(" + this.from + "..." + this.to + ")"; }
};
