
var express = require('express');
var app = express();

//
var listRoutes = require("./script/listRoutes");
listRoutes(app);
var versionRoutes = require("./script/versionRoutes");
versionRoutes(app);


var conf = require("./conf/config")

// app.get('/info', function (req, res) {
// 	res.send('This is a Ajax info to dom text: Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.5');
// });

// app.post('/atomlogin', function (req, res) {

// 	var alldata ='';
//     req.on('data',function(chunk){
//         alldata+=chunk;
//     })
//     req.on('end', function () {
//         var datastring = alldata.toString()//得到的是一个字符串 需要解析
//         var obj= querystring.parse(datastring);//定义一个对象来存放解析后的值
//         console.log(obj.atomaccount);
//         console.log(obj.atompassword);
//         res.send('Hello World'+ obj.atomaccount);
//     })
// });



app.listen(3600, function () {
  	console.log('版本服务启动 : 3600');
});

app.use(express.static("./../loader"))

module.exports = app;