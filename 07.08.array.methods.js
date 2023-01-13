//数组方法

//join

var a = [1,2,3];
a.join();

a.join(" ");
a.join("");

var b = new Array(10);
b.join("-"); // ----

//reverse
//他不创建新的数组
a.reverse();

//sort
var a = ["banana", "cherry", "apple"];
a.sort();
var s = a.join(",  "); // s = "apple,banana,cherry"

var a = [33,4,1111,222];
a.sort(function(a,b) {return a-b;});
a.sort(function(a,b) {return b-a;});
a = ['ant', 'Bug', 'cat', 'Dog'];
a.sort();
a.sort(function(s,t) {
    var a = s.toLowerCase();
    var b = t.toLowerCase();
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
});



// 连接 （concat)
var a = [1,2,3];
a.concat(4,5);
a.concat([4,5]);
a.concat([4,5],[6,7]);
a.concat(4,[5,[6,7]]);


// slice
// 关键点，slice是支持负数的
var a = [1,2,3,4,5];
a.slice(0,3);
a.slice(3);
a.slice(1,-1);
a.slice(-3,-2);



// splice
//插入和删除元素的通用的方法
// 返回被删除的元素
var a = [1,2,3,4,5,6,7,8];
a.splice(4); //返回[5,6,7,8]
a.splice(1,2);
a.splice(1,1);

var a = [1,2,3,4,5];
a.splice(2,0,'a','b');

//push和pop
var stack = [];
stack.push(1,2);
stack.pop();
stack.push(3);
stack.pop();
stack.push([4,5]);
stack.pop();
stack.pop();


//shift和unshift
var a = [];
a.unshift(1);
a.unshift(22);
a.shift();
a.unshift(3,[4,5]);
a.shift();
a.shift();
a.shift();

//toString()和toLocaleString()
[1,2,3].toString();


//下面的方法是ECMAScript下的数组方法
