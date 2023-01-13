#! /usr/local/bin/node
var fs = require('fs')

function done() {
    // do nothing
}

function fileCopy(filename1, filename2) {
    var input = fs.createReadStream(filename1);
    var output = fs.createWriteStream(filename2);

    input.on("data", function(data) { output.write(data);});
    input.on("error", function(err) { throw err;});
    input.on('end', function() { output.end();
        if (done) done();
    })
}

if (process.argv.length < 3) throw "argument error: fileCopy filename1 filename2";

// argc 0 is the nodeJs, argv[2] is the input file, while argv[3] is the output file
var file1 = process.argv[2]
var file2 = process.argv[3]
process.stdout.write("copying file from " + file1 + " to " + file2);

fileCopy(file1, file2)