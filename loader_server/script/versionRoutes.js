const conf = require("./../conf/config");
const versionMgr = require("./gameVersionMgr");

const multer  = require('multer');
var storage = multer.diskStorage({
  //设置上传后文件路径,文件夹会自动创建。
  destination: function (req, file, cb) {
    cb(null, conf.zipSaveDir)
  }, 

  //给上传文件重命名，获取添加后缀名
  filename: function (req, file, cb) {
    var fileFormat = (file.originalname).split(".");
    cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
});
var upload = multer({ storage: storage }) 


//获取游戏版本列表
function getGameVersions(req,res){
    console.log(">>>> getGameVersions ");
    var query = req.query;
    if(query){
        console.log(query)
        var gameid  = query.gameid;
        var mode    = query.mode;
        if(gameid && mode){
            var versions = versionMgr.getVersions(mode,gameid)
            if(versions){
                res.send(JSON.stringify(versions));
                return 
            }
            
            res.send(JSON.stringify({ code:0 , msg:"没有游戏版本" }));
        }else{
            res.send(JSON.stringify({ code:0 , msg:"游戏内容不能为空" }));
        } 
    }   
}

//创建一个新的游戏版本
function createVersion(req,res,next){
    var file =req.file;
    var body =req.body;

    var version = body.version;
    var baseVersion = body.baseVersion;
    var gameid = body.gameid;
    var mode = body.mode;

    if(version && gameid && mode){
        //检查是否已有的版本. 不存在的话就创建一个文件夹
        var check = versionMgr.checkAndCreate(gameid, version, mode)
        if(check == true){
            res.send(JSON.stringify({ code:0 , msg:"不能创建已有的版本" }));
            return 
        }
        //filename //file.filename


        //热更内容的比对和生成操作
        versionMgr.makeVersionManifast(file.filename , gameid ,version ,baseVersion ,mode ,function(code_ , msg_){
            console.log(">>> 版本操作创建结果" + gameid  + " "+ version + "  code:" + code_ + " msg:"+ msg_);
            //返回内容
            res.send(JSON.stringify({ code:code_ , msg:msg_ }));
        })
    }else{
        res.send(JSON.stringify({ code:0 , msg:"游戏版本内容不能为空" }));
    }
}

module.exports = function(app){
    if(app){
        //监听 list列表的相关接口
        app.get("/gameversions", getGameVersions); //获取游戏版本列表
        app.post("/uploadVersion", upload.single('zipfile') , createVersion); //接收上传的Zip
    }
}