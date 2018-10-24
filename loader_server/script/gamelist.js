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
gamelist_info.prototype.addGameItem = function(item, type_){
	if(item && type_){
		if(type_ == "dev"){
			this.games.dev.unshift(item)
		}else{
			this.games.dis.unshift(item)
		}
	}	
};

//序列化成文件
gamelist_info.prototype.localSave = function(){
	
};

const gamelist = new gamelist_info()
module.exports = gamelist
