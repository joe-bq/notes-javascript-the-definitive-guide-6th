// 查看properties
Object.getOwnPropertyDescriptor({x:1}, "x");

// 查看accessor的属性   
Object.getOwnPropertyDescriptor(random, "octet");

// on inheritence 
Object.getOwnPropertyDescriptor({}, "x");
Object.getOwnPropertyDescriptor({}, "toString");


// 创建一个属性
var o = {};

Object.defineProperty(o, "x", {value: 1, writable: true, configurable: true, enumerable: false});

o.x // has value - readable
Object.keys(o); // => []


Object.defineProperty(o, "x", {writable: false});

o.x = 2;  // 严格模式会报错

Object.defineProperty(o, "x", {value: 2});

Object.defineProperty(o, "x", {get: function() {return 0;}});

// 使用defineProperties创建属性
var p = Object.defineProperties({}, {
    x: {value: 1, writable: true, configurable: true, enumerable: true},
    y: {value: 1, writable: true, configurable: true, enumerable: true},
    r: {get: function() {
        return Math.sqrt(this.x*this.x+this.y*this.y);
    },  configurable: true, enumerable: true},
});