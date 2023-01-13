//本文是用用来如何使用 
//定义
//字符类
//重复 -也称作是quantifier （greedy 和non-greedy)
//选择、分组和引用


//javascript 支持regularexpression的直接量的定义 
var pattern = /s$/

//或者是通过如下的正则表达式来定义
var pattern = new RegExp("s$");


// 
//字符
//字母和数字字符
//\0 - NULL
//\t - tab
//\n - newline
//\v - vertical
//\f - 换行符
//\r - 十六进制 nn 制定的拉丁字符
//\xnn - - 十六进制的拉丁字符
//\uxxxx - unicode
//\cX - 控制字符



// 字符类
//[...]
//[^...]
//.
//\w
//\W
//\s
//\S
//\d
//\D
//[\b] - 退格直接量

// 重复

//{n,m}
//{n,}
//{n}
//?
//+
//*

// 非贪婪的重复
//??
//+?
//*?


// 选择和分组和引用 
/ab|cd|ef/

// 一个使用了引用的匹配的引号的示例

// /(['"])[^'"]\1/


// 只分组不做引用的例子

/([Jj]ava(?:[Ss]cript)?)\sis\s(fun\w)/

//| - 选择
//(...) - 分组
//(?:...) - 只分组，不记忆
//\n - 引用



// 接下来

// 断言、指定位置

// ^
// $
// \b 
// (?=) - 先行断言
// (?=) - 负向先行断言



// 修饰符 
// i - 执行不区分大小写的匹配 
// g - 执行一个全局匹配 
// m - 多行匹配 



// javascript支持4种使用正则表达式的方法
// search() -- 返回第一个匹配的字符的位置
// replace() - 替换,替换支持使用 引用
// match() - 匹配，数组结果 a[0] 表示的是完整的匹配 ， a[1]是第一个分组的匹配 ，a[2] 以此类推
// split() - 主要是做的拆分 


//
// "Javascript".search(/script/i);


//所有的不区分大小写的Javacript的转化成大小写正确的 

var text = "javascript"
text.replace(/javascript/gi, "JavaScript");


//replace加上引用的使用方式 
var quote = /"([^"]*)"/g;
text.replace(quote, '“\1“');


var url = /(\w+):\/\/([\w.]+)\/(\S*)/;
var text = "Visit my blog at http://www.example.com/~david";

var result = text.match(url)
if (result != null) {
    var fullurl = result[0];
    var protocal = result[1];
    var host = result[2];
    var path = result[3];
}



"123,456,789".split(",");
"1, 2, 3, 4, 5".split(/\s*,\s*/);


//

var pattern = /Java/g;

var text = "Javascript is more fun than Java!";
var result;
while((result = pattern.exec(text)) != null) { 
    alert("Matched  '" + result[0] + "'" + 
    " at position " + result.index + 
    "; next search begins at " + pattern.lastIndex);
}


var pattern = /java/i;
pattern.test("Javascript"); // 返回true

pattern.exec("Javascript"); // 一个非空的数组