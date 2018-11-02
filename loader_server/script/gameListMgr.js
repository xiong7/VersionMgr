const fs = require("fs");
const conf = require("./../conf/config")
const utils = require("./utils")
function gamelist_info(){
	// 异步读取
	console.log(conf)
	var data = fs.readFileSync(conf.gamelistFile);
	this.games = JSON.parse(data.toString()); 
};

//获取测试游戏列表
gamelist_info.prototype.getDevList = function(){
	if(this.games){
		return this.games.dev
	}
};

//获取正式游戏列表
gamelist_info.prototype.getDisList = function(){
	if(this.games){
		return this.games.dis
	}
};

//获取整个游戏列表
gamelist_info.prototype.getGameList = function(){
	if(this.games){
		return this.games
	}
};

//创建一个游戏节点
gamelist_info.prototype.makeGameItem = function(){
	var data_ = {};
	const time_= new Date().format("yyyy-MM-dd hh:mm:ss"); 
	data_.time   = time_;
	data_.author = "default";
	data_.icon   = "default.png"

	return data_
};

//添加游戏节点到列表中
gamelist_info.prototype.addGameItem = function(item, mode){
	if(item && mode){
		if(mode == conf.Dev){
			this.games.dev.unshift(item)
		}else{
			this.games.dis.unshift(item)
		}

		
	}	
};

//检查游戏ID
gamelist_info.prototype.checkID = function(gameid,mode){
	var list = this.games.dis;
	if(mode == conf.Dev){
		list = this.games.dev;
	}

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		if(item && item.id == gameid){
			return true
		}
	};

	return false;
};

gamelist_info.prototype.makeDir = function(item_){
	if(item_){
		var mode   = item_.mode;
		var gameid = item_.id;

		var dir = conf.gameDisDir + "/" + gameid;
		if(mode == conf.Dev){
			dir = conf.gameDevDir + "/" + gameid;
		}

		fs.mkdir(dir,function(error){
		    if(error){
		    	console.log('makeDir >>> 创建目录失败' + gameid);
		        console.log(error);
		        return false;
		    }
		    console.log('>>> 创建目录成功' + gameid );
		})
	}
};

//序列化成文件
gamelist_info.prototype.localSave = function(){
	var str = JSON.stringify(this.games)
	fs.writeFileSync(conf.gamelistFile,str);
};

const gamelist = new gamelist_info()
module.exports = gamelist
