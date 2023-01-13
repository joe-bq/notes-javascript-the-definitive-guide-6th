var o = {
    x: 1.0,
    y: 2.0,
    get r() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },
    set r(newvalue) { 
        var oldvalue = Math.sqrt(this.x * this.x + this.y * this.y);
        var ratio = newvalue / oldvalue;
        this.x = this.x * ratio;
        this.y = this.y * ratio;
    },
    get theta() { 
        return Math.atan2(this.y, this.x);
    }
};



// 
var q = inherit(p);
q.x = 1, q.y = 1;
console.log(q.r)
console.log(q.theta)


// 通过上述的方式创建一个方法
var serialnum = {
    $n: 0,

    get next() { 
        return this.$n++;
    },

    set next(value) {
        if (value >= this.$n) { 
            this.$n = value;
        } else { 
            throw new Error("序列号的值不能比当前的值小")
        }
    }
};



var random = {
    get octet() { return Math.floor(Math.random() * 256); },
    get uint16() { return Math.floor(Math.random() * 65536); },
    get int16() { return Math.floor(Math.random() * 65536) - 32768; }
};