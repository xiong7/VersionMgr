const fs = require("fs");
const conf = require("./../conf/config")
const utils = require("./utils")

function gameitems_info(){

};

//获取测试游戏列表
gameitems_info.prototype.getVersions = function(mode,gameid){
	if(mode && gameid){
		var dirpath = conf.gameDevDir + "/" + gameid
		if(mode == conf.Dis){
			dirpath = conf.gameDisDir + "/" + gameid
		}

		var info = fs.statSync(dirpath)	
		if(info.isDirectory()){
			var data = this.readDirSync(dirpath)
			return data
		}
	}
};

//
gameitems_info.prototype.readDirSync = function(path){
	var dir_data = [];
	var pa = fs.readdirSync(path);
	pa.forEach(function(ele,index){
		var info = fs.statSync(path+"/"+ele)	
		if(info.isDirectory()){
			console.log("dir: "+ele)
			var obj  = {};
			obj.type  = "dir";
			obj.value = ele;
			dir_data.push(obj);
		}else{
			console.log("file: "+ele)
			var obj  = {};
			obj.type  = "file";
			obj.value = ele;
			dir_data.push(obj);
		}	
	})
	return dir_data
}


//检查版本是否存在
gameitems_info.prototype.checkAndCreate = function(gameid, version ,mode){
	var versions = this.getVersions(mode,gameid);
    if(versions){
        for (var i = 0; i < versions.length; i++) {
        	var item = versions[i];
        	if(item && item.value == version){
        		return true;
        	}
        };

        var dir = conf.gameDisDir + "/" + gameid + "/" + version;
		if(mode == conf.Dev){
			dir = conf.gameDevDir + "/" + gameid + "/" + version;
		}
        //创建对应的文件夹
        fs.mkdir(dir,function(error){
		    if(error){
		    	console.log('makeDir >>> 创建版本目录失败' + gameid + "  " + version);
		        console.log(error);
		        return false;
		    }
		    console.log('>>> 创建目录成功'  + gameid + "  " + version);
		})

        return false;
    }
}


//热更内容的比对和生成操作
gameitems_info.prototype.makeVersionManifast = function(filename , gameid, version , baseVersion ,mode, callback){
	if(filename && gameid && version && mode){
		//清空temp文件夹
		utils.cleanDir(conf.tempDir , function(status){
			if(status == false){
				console.log("无法清空temp文件夹");
				callback(0 , "无法清空缓存文件夹");
				return ;
			}
			var zippath = conf.zipSaveDir + "/" +filename
			//判断文件是否存在
			fs.exists(zippath , function(exists) {  
		        if(exists) {
		        	//解压操作 --直接解压到Backup 中
		        	var temppath = conf.tempDir + "/comp_"+ version
		        	var backuppath = conf.versionBackup + "/" + gameid + "/" + version
		            utils.unzip(zippath , backuppath ,function(status){
		            	if(status==false){
							callback(0 , "解压ZIP失败");
		            		return 
		            	}

						//比对基础版本文件 使用备份资源中的内容进行版本的比对
				    	if(typeof(baseVersion) == "string" && baseVersion != "undefined"){
				    		console.log(">>> baseVersion "+ baseVersion + typeof(baseVersion));
				    		var baseDir = conf.versionBackup + "/" + gameid + "/" + baseVersion 
				    		if(mode == conf.Dis){
				    			baseDir = conf.versionBackup + "/" + gameid + "/" + baseVersion 
				    		}

				    		utils.compareDir(baseDir , backuppath , temppath, function(status){
				    			if(status == false){
									callback(0 , "版本比对失败");
				    				return
				    			}
				    			//压缩目录
				    			var zippath = conf.tempDir + "/"+ version + ".zip"
				    			utils.zip(temppath , zippath , function(status){
				    				if(status == false){
				    					callback(0 , "压缩比对内容失败");
				    					return 
				    				}

				    				var manifest = makeManifest(version);
				    			})

				    		})
				    	}else{
				    		//自己为基础版本
				    		var manifest = makeManifest(version)
				    	}

				    	callback(1 , "success");

		            })
		        } else {
		            console.log(">>> zip 文件不存在 <<<" + zippath);
		            callback(0 , "ZIP 文件不存在");
		        }
	    	});
		});
	}else{
		console.log(">>> makeVersionManifast 参数空");
	}
}


gameitems_info.prototype.makeManifest = function(version){

}

const gameitems = new gameitems_info()
module.exports = gameitems