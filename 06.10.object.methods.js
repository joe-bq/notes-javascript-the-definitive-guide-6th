//这里主要是展示如何使用Object.方法
var s = {x:1,y:1}.toString();


// 这个主要是localeString
var s1 = {x:1,y:1}.toLocaleString();


// Object.prototype()实际上没有定义toJSON方法，但是在 JSON.stringify的时候会调用它
// 具体的例子可以参考Date.toJSON()
//Date.toJSON() 方法获得了定义
console.log(new Date().toJSON());
// 
var date = Date.valueOf('2022-10-21 10:00:00.389');
console.log(date);