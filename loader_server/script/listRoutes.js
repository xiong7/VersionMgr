
const conf = require("./../conf/config");
const gameMgr = require("./gameListMgr");


const multer  = require('multer');
var storage = multer.diskStorage({
  //设置上传后文件路径,文件夹会自动创建。
  destination: function (req, file, cb) {
    cb(null, conf.iconSaveDir)
  }, 

  //给上传文件重命名，获取添加后缀名
  filename: function (req, file, cb) {
    var fileFormat = (file.originalname).split(".");
    cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
});
var upload = multer({ storage: storage }) 


//获取游戏列表
function getGameList(req , res){
    console.log(">>>> getGameList  ");
    var query = req.query;
    if(query){
        console.log(query)
        var mode = query.mode;
        if(mode){
            var data = {};
            if(mode == conf.Dev){
                data = gameMgr.getDevList();
            }else{
                data = gameMgr.getDisList();
            }

            res.send(JSON.stringify(data));
        } 
    }  
}

//创建一个新的游戏 需要检验游戏ID 是否使用过
function createGame(req,res,next){
    console.log(">>>> createGame  ");
    var file =req.file; //文件
    var body =req.body;

    var mode = body.mode;
    var name = body.name;
    var gameid = body.gameid;

    if(name && gameid && mode){
        //检查游戏ID是否重复
        var check = gameMgr.checkID(gameid , mode);
        if(check == true){
            console.log("不能创建重复的ID" + gameid);
            res.send(JSON.stringify({ code:0 , msg:"重复的游戏ID" }));
            return 
        }

        var item_ = gameMgr.makeGameItem();
        item_.name = name;
        item_.id   = gameid;
        item_.mode = mode;
        item_.icon = file.filename;
        gameMgr.addGameItem(item_ , mode);
        gameMgr.localSave();
        gameMgr.makeDir(item_);

        //返回内容
        res.send(JSON.stringify({ code:1 , msg:"success" }));
    }else{
        res.send(JSON.stringify({ code:0 , msg:"游戏信息内容不能为空" }));
    }
}



module.exports = function(app){
    if(app){
        //监听 list列表的相关接口
        app.get("/gamelist", getGameList); //获取列表
        app.post("/upload", upload.single('iconfile') , createGame); //接收上传的ICON
    }
}