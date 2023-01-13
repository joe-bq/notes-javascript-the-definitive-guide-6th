// 说明，本文主要是说明如何使用serialization

o = {x:1,y:{z:[false,null,""]}};

s = JSON.stringify(o);
p = JSON.parse(s);