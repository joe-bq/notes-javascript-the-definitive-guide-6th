// 这个例子的作用： 是告诉你， 在不支持async属性的javascript 如何做到可以做异步的加载
//

// Asynchronously load and execute a script from a specified URL
function loadasync(url) { 
    var head = document.getElementsByTagName("head")[0]; // Find document <head>
    var s = document.createElement("script");  // Create a <script> element
    s.src = url;                               // Set its src attribute 
    head.appendChild(s);                       // Insert the <script> into head
}
