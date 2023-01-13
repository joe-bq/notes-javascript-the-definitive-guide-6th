#! /usr/local/bin/node

// 用这个方法可以对一个目录做分析
var fs = require('fs'), path = require('path');
var dir = process.cwd();

if (process.argv.length > 2) dir = process.argv[2];
var files = fs.readdirSync(dir);
process.stdout.write("Name\tSize\tDate\n");
files.forEach(function(filename) {
    var fullname = path.join(dir, filename);
    var stats = fs.statSync(fullname);
    if (stats.isDirectory()) filename += "/";
    process.stdout.write(filename + "\t" + 
    stats.size + "\t" + 
    stats.mtime + "\n")
});