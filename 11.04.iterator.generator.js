//本文是关于 javascript下的迭代器，generator的说明
//EAX - ECMAScript for XML 是一个扩展

let o = {one:1, two:2, three:3};

// for on key
for (let p in o ) { console.log(p); }

// for each on value
// author 笔记: 这个在 spidermonkey这个实现上是不支持的， 在firefox 上可能是可以支持的？？
for each (let v in o) { console.log(v); }



//javascript 1.7支持了迭代器
//他可以遍历任何可以迭代的对象 (iterable)
//可迭代的对象支持next()方法

//返回迭代器的一个函数
function counter(start) { 
    let nextValue = Math.round(start);
    return {next: function() {return nextValue++; }}
}


let serialNumberGenerator = counter(1000);
let sn1 = serialNumberGenerator.next(); // 1000
let sn2 = serialNumberGenerator.next(); // 1001



//如何终止迭代， StopIteration - 它是一个保留对象， 他不是一个异常
function rangeIter(first, last) { 
    let nextValue = Math.ceil(first);
    return { 
        next: function() { 
            if (nextValue > last) {
                throw StopIteration;
            }
        }
    };
}

//获得迭代器
let r = rangeIter(1,5);//迭代器对象
while (true) {
    try { 
        console.log(r.next); //next对象
    } catch (e) { 
        if (e == StopIteration) break; //如果跑出终止，stopIteration 那么终止循环
        else throw e;
    }
}

//一般大家也不这么使用
//for/in 循环做过增强；
// __iterator__
// 自动调用 next() 函数
function range(min, max) { 
    return { 
        get min() { 
            return min;
        },
        get max() { 
            return max;
        },
        includes: function(x) { 
            return min <= x && x <= max;
        }, 
        toString: function() {
            return "[" + min + "," + max + "]";
        },
        __iterator__: function() { 
            let val = Math.ceil(min);
            return {
                next: function() { 
                    if (val > max) {
                        throw StopIteration;
                    }
                    return val++;
                }
            };
        }
    };
}

//调用区间的值做一下迭代
//author 笔记： 这个方法， for .. in 不工作
// 看下面的for...of...
// for (let i in range(1, 10)) { 
//     console.log(i);
// }

//下面的方法也不奏效
for (let i of range(1,10)) { 
    console.log(i);
}

//可以看一下 
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_generators

function makeRangeIterator(start = 0, end = Infinity, step = 1) {
    let nextIndex = start;
    let iterationCount = 0;
  
    const rangeIterator = {
      next() {
        let result;
        if (nextIndex < end) {
          result = { value: nextIndex, done: false };
          nextIndex += step;
          iterationCount++;
          return result;
        }
        return { value: iterationCount, done: true };
      }
    };
    return rangeIterator;
  }


const it = makeRangeIterator(1, 10, 2);

let result = it.next();
while (!result.done) {
 console.log(result.value); // 1 3 5 7 9
 result = it.next();
}

console.log("Iterated over sequence of size: ", result.value); // [5 numbers returned, that took interval in between: 0 to 10]



// generator, function
// 上面的繁琐的代码， 可以简化成如下的代码
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators
function* makeRangeIterator(start = 0, end = Infinity, step = 1) {
    let iterationCount = 0;
    for (let i = start; i < end; i += step) {
      iterationCount++;
      yield i;
    }
    return iterationCount;
}



// --- 
function* makeIterator() {
    yield 1;
    yield 2;
  }
  
const it = makeIterator();

for (const itItem of it) {
  console.log(itItem);
}

console.log(it[Symbol.iterator]() === it); // true

// This example show us generator(iterator) is iterable object,
// which has the @@iterator method return the it (itself),
// and consequently, the it object can iterate only _once_.

// If we change it's @@iterator method to a function/generator
// which returns a new iterator/generator object, (it)
// can iterate many times
it[Symbol.iterator] = function* () {
  yield 2;
  yield 1;
};

//
function* makeIterator() {
    yield 1;
    yield 2;
}

const it = makeIterator();

for (const itItem of it) {
  console.log(itItem);
}

console.log(it[Symbol.iterator]() === it); // true




//user-defined iterables
const myIterable = {
    *[Symbol.iterator]() {
      yield 1;
      yield 2;
      yield 3;
    }
  }


  for (const value of myIterable) {
    console.log(value);
  }
  // 1
  // 2
  // 3


  //or you can convert into spread with ... operation
  [...myIterable]; // [1, 2, 3]


// 下面这么写不成功
// function* range(min, max) { 
//     for (let i = Math.ceil(min); i < max; i++) { 
//          yield i;
//     }
//  }

// for (let i in range(5, 10)) { console.log(i); }

//这么写， 可以
function* range(min, max) { 
    for (let i = Math.ceil(min); i < max; i++) { 
         yield i;
    }
 }
for (let i of range(5, 10)) { console.log(i); }


// rhino book的例子如下:
// 但是实际上是不成功的
//
// A generator to yield the lines of the string s one at a time.
// Note that we don't use s.split(), because that would process the entire
// string at once, allocating an array, and we want to be lazy instead.
function eachline(s) {
    let p;
    while((p = s.indexOf('\n')) != -1) {
        yield s.substring(0,p);
        s = s.substring(p+1);
    }
    if (s.length > 0) yield s;
}

// A generator function that yields f(x) for each element x of the iterable i
function map(i, f) {
    for(let x in i) yield f(x);
}

// A generator function that yields the elements of i for which f(x) is true
function select(i, f) {
    for(let x in i) {
        if (f(x)) yield x;
    }
}

// Start with a string of text to process
let text = " #comment \n  \n  hello \nworld\n quit \n unreached \n";

// Now build up a pipeline of generators to process it.
// First, break the text into lines
let lines = eachline(text);
// Next, trim whitespace from the start and end of each line
let trimmed = map(lines, function(line) { return line.trim(); });
// Finally, ignore blank lines and comments
let nonblank = select(trimmed, function(line) {
    return line.length > 0 && line[0] != "#"
});

// Now pull trimmed and filtered lines from the pipeline and process them,
// stopping when we see the line "quit".
for (let line in nonblank) {
    if (line === "quit") break;
    console.log(line);
}


// ==== 
// 下面的代码工作
function* eachline(s) {
    let p;
    while((p = s.indexOf('\n')) != -1) {
        yield s.substring(0,p);
        s = s.substring(p+1);
    }
    if (s.length > 0) yield s;
}

function* map(i, f) {
    for(let x of i) yield f(x);
}

function* select(i, f) {
    for(let x of i) {
        if (f(x)) yield x;
    }
}

let text = " #comment \n  \n  hello \nworld\n quit \n unreached \n";
let lines = eachline(text);
let trimmed = map(lines, function(line) { return line.trim(); });
let nonblank = select(trimmed, function(line) {
    return line.length > 0 && line[0] != "#"
});

for (let line of nonblank) {
    if (line === "quit") break;
    console.log(line);
}




// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators
//iterators and generators
//下面的代码中 - 
// const reset = yield current
// 如果输入是 
//  sequence.next(true) 
// 相当于给 yield 输入了一个值
// 下面的判断 
//    if (reset) { 
//        
// }
// 会重置current, next, 
//并进入到下一个循环
function* fibonacci() {
    let current = 0;
    let next = 1;
    while (true) {
      const reset = yield current;
      [current, next] = [next, next + current];
      if (reset) {
        current = 0;
        next = 1;
      }
    }
  }


const sequence = fibonacci();
console.log(sequence.next().value);     // 0
console.log(sequence.next().value);     // 1
console.log(sequence.next().value);     // 1
console.log(sequence.next().value);     // 2
console.log(sequence.next().value);     // 3
console.log(sequence.next().value);     // 5
console.log(sequence.next().value);     // 8
console.log(sequence.next(true).value); // 0
console.log(sequence.next().value);     // 1
console.log(sequence.next().value);     // 1
console.log(sequence.next().value);     // 2



// == 数组推导 
// 这里例子不管用
// https://developer.mozilla.org.cach3.com/en-US/docs/Web/JavaScript/Reference/Operators/Array_comprehensions
let evensquares = [x * x for (x in range(0, 10)) if (x % 2 === 0)]


// array compressions
// 数组推导 
// 但是看起来不是没有通过
// https://lia.disi.unibo.it/materiale/JS/developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Array_comprehensions.html
// 下面的代码不支持；
let evensquares = [for (x of range(0, 10)) if (x %2 ===2 )  x * x]

// 这个也是不支持的， 但是可以使用上面的 Generators
// 见这里 
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator
// 下面的代码不支持
let evensquares = (for (x of range(0, 10)) if (x %2 ===2 )  x * x)


// 下面的代码是支持的代码
const foo = function*() {
    yield 'a';
    yield 'b';
    yield 'c';
  };
  
  let str = '';
  for (const val of foo()) {
    str = str + val;
  }
  
  console.log(str);
  // Expected output: "abc"


  // multiple-try
// 这个也是不支持的
// 可以看这里
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch
// 下面的代码不支持；
  try { 
    // 抛出异常
    throw 1 ;
  } catch (e if e instanceof ReferenceError) {
    console.log("ReferenceError")
  } atch (e if e === "quit") {
    console.log("quit error")
  } catch (e if typeof e === "string") {
    console.log("typeof e is string")
  } catch (e) {
    console.log("rest exception")
  } finally { 
    console.log("you finally is here")
  }