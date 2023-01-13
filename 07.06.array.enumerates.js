zz//数组遍历
var keys = Object.keys(o);

//简单通过数组下标遍历
var values = [];
for (var i = 0; i < keys.length; i++) { 
    var key = keys[i];
    values[key] = o[key];
}


//跳过null,undefined,和不存的
for (var i = 0; i < keys.length; i++) { 
    if (!a[i]) {
        continue;
    }

    var key = keys[i];
    values[key] = o[key];
}


//跳过不存在，但是可以是undefined
//跳过null,undefined,和不存的
for (var i = 0; i < keys.length; i++) { 
    if (!(i in o)) {
        continue;
    }

    var key = keys[i];
    values[key] = o[key];
}


//上面的方式的写法是可以这样
for (var index in sparsearray) { 
    //不存在的索引不会
    var value = sparsearray[index];
    // 此处使用索引
}


// 上面的方法有一个问题，如果是Array.prototype有继承的可枚举的索引，会导致
for (var i in a) {
    if (!a.hasOwnProperty(i)) { 
        continue;
    }
    // 
}

//跳过不是非负整数的属性
for (var i in a) {
    if (String(Math.floor(Math.abs(Number(i)))) !== i) {
        continue;
    }
    // 
}

// ECMAScript 5定义了遍历的新方法


var data = [1,2,3,4,5];
var sumOfSquares = 0;

data.forEach(function(x) {
    sumOfSquares += x * x ;
});
 
sumOfSquares;