// 这句的意思就是引入 `express` 模块，并将它赋予 `express` 这个变量等待使用。
var express = require('express');
// 调用 express 实例，它是一个函数，不带参数调用时，会返回一个 express 实例，将这个变量赋予 app 变量。
var app = express();

var gamelist = require("./script/gamelist")



var multer  = require('multer');
var storage = multer.diskStorage({
  //设置上传后文件路径，"d:/myapp/public/uploads文件夹"会自动创建。
  destination: function (req, file, cb) {
    cb(null, './../loader/icons')
  }, 
  //给上传文件重命名，获取添加后缀名
  filename: function (req, file, cb) {
    var fileFormat = (file.originalname).split(".");
    cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
});
var upload = multer({ storage: storage }) 

// app 本身有很多方法，其中包括最常用的 get、post、put/patch、delete，在这里我们调用其中的 get 方法，为我们的 `/` 路径指定一个 handler 函数。
// 这个 handler 函数会接收 req 和 res 两个对象，他们分别是请求的 request 和 response。
// request 中包含了浏览器传来的各种信息，比如 query 啊，body 啊，headers 啊之类的，都可以通过 req 对象访问到。
// res 对象，我们一般不从里面取信息，而是通过它来定制我们向浏览器输出的信息，比如 header 信息，比如想要向浏览器输出的内容。这里我们调用了它的 #send 方法，向浏览器输出一个字符串。
app.get('/info', function (req, res) {
	res.send('This is a Ajax info to dom text: Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.Hello World.5');
});

app.post('/atomlogin', function (req, res) {

	var alldata ='';
    req.on('data',function(chunk){
        alldata+=chunk;
    })
    req.on('end', function () {
        var datastring = alldata.toString()//得到的是一个字符串 需要解析
        var obj= querystring.parse(datastring);//定义一个对象来存放解析后的值
        console.log(obj.atomaccount);
        console.log(obj.atompassword);
        res.send('Hello World'+ obj.atomaccount);
    })
});

app.get("/gamelist", function(req , res){
    var query = req.query;
    if(query){
        console.log(query)
        var _type = query.mode;
        if(_type){
            var data = {};
            if(_type == "dev"){
                data = gamelist.getDevList();
            }else{
                data = gamelist.getDisList();
            }

            res.send(JSON.stringify(data));
        } 
    }   
});

app.get("/createitem",function(req,res){
    console.log(">>>> createitem ");
    var query = req.query;
    if(query){
        console.log(query)
        var name    = query.name;
        var gameid  = query.gameid;
        var mode    = query.mode;

        if(name && gameid && mode){
            var item_ = gamelist.makeGameItem()
            item_.name = name;
            item_.id   = gameid;
            item_.type = mode;

            gamelist.addGameItem(item_ , mode);
            gamelist.localSave();

            //返回内容
            var data = {}
            data.code = 1;
            data.msg  = "success"
            res.send(JSON.stringify(data));
        }else{
            var data = {}
            data.code = 0;
            data.msg  = "游戏信息内容不能为空"
            res.send(JSON.stringify(data));
        } 
    }   
});

//单文件上传获取信息
app.post('/upload',upload.single('myfile'),function(req,res,next){
    // console.log(req);
    var file =req.file;
    var body =req.body;

    var mode = body.mode;
    var name = body.name;
    var gameid = body.gameid;

    if(name && gameid && mode){
        var item_ = gamelist.makeGameItem()
        item_.name = name;
        item_.id   = gameid;
        item_.type = mode;
        item_.icon = file.filename
        gamelist.addGameItem(item_ , mode);
        gamelist.localSave();

        //返回内容
        var data = {}
        data.code = 1;
        data.msg  = "success"
        res.send(JSON.stringify(data));
    }else{
        var data = {}
        data.code = 0;
        data.msg  = "游戏信息内容不能为空"
        res.send(JSON.stringify(data));
    }

  // console.log("original file name is "+file.originalname);//original file name is 20170615_211619.jpg
  // console.log("file name is " + file.filename);//file name is myfile-1511013577361.jpg
  // res.send({ret_code: '0'});//这行代码必须要有，否则Browser会处于wait状态。
})


// 定义好我们 app 的行为之后，让它监听本地的 3000 端口。这里的第二个函数是个回调函数，会在 listen 动作成功后执行，我们这里执行了一个命令行输出操作，告诉我们监听动作已完成。
app.listen(3600, function () {
  	console.log('app is listening at port 3600');
});

app.use(express.static("./../loader"))

module.exports = app;