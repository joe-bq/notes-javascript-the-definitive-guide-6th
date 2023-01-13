//特殊的length的属性

a = [1,2,3,4,5]
a.length=3; //截短
a.length=0; //删除所有的元素
a.length=5; // 这个处理办法是和new Array()是一致的

//限制length的操作
a = [1,2,3];
Object.defineProperty(a, "length", {writable:false});
a.length = 0;