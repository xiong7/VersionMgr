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
	var that = this
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
		        	var gamepath = conf.versionBackup + "/Dev/" + gameid
		        	var backuppath = conf.versionBackup + "/Dev/" + gameid + "/" + version
		        	if(mode == conf.Dis){
		    			gamepath = conf.versionBackup + "/Dis/" + gameid
		    			backuppath = conf.versionBackup + "/Dis/" + gameid + "/" + version
		    		}

		    		//解压之前如果本地有一个同版本的目录先删了(页面的删除版本只删除 game中的更新内容 ,不会连带backUp也删了，但是重新添加版本就会优先删除残留的版本内容)
		    		utils.cleanDir(backuppath , function(status){
		    			if(status == false){
		    				callback(0 , "清除残留的版本失败!");
		            		return 
		    			}
		    			
		    			utils.unzip(zippath , gamepath ,function(status){
			            	if(status==false){
								callback(0 , "解压ZIP失败");
			            		return 
			            	}

							//比对基础版本文件 使用备份资源中的内容进行版本的比对
					    	if(typeof(baseVersion) == "string" && baseVersion != "undefined"){
					    		console.log(">>> baseVersion "+ baseVersion + typeof(baseVersion));
					    		var baseDir = conf.versionBackup + "/Dev/" + gameid + "/" + baseVersion 
					    		if(mode == conf.Dis){
					    			baseDir = conf.versionBackup + "/Dis/" + gameid + "/" + baseVersion 
					    		}

					    		utils.compareDir(baseDir , backuppath , temppath, function(status){
					    			if(status == false){
										callback(0 , "版本比对失败");
					    				return
					    			}
					    			//内容特殊操作:加密、混淆or其他
					    			that.scriptEncrypt( temppath , function(status){
					    				if(status == false){
					    					callback(0 , "脚本特殊处理失败");
					    					return;
					    				}

					    				//压缩目录 (压缩目标目录中的内容需要到目录中才能获得正常的压缩内容)
						    			var zippath = "./../" + version + ".zip" //conf.tempDir + "/"+ version + ".zip"
						    			utils.zip(temppath , zippath , function(status){
						    				if(status == false){
						    					callback(0 , "压缩比对内容失败");
						    					return 
						    				}

						    				//拷贝迭代版本的版本内容到新版的update下
						    				var after_zippath = conf.tempDir + "/"+ version + ".zip" //上面那个zippath 是给zip命令用的真操蛋
						    				that.copyBaseVersionManifest(gameid , baseVersion , version , after_zippath , mode ,function(status){
						    					if(status == false){
						    						callback(0 , "迭代内容失败");
						    						return
						    					}

						    					that.copy2downloadServer(mode, gameid , version , function(status){
						    						if(status==false){
						    							callback(0 , "迭代内容拷贝到下载服失败");
						    							return
						    						}
						    						callback(1 , "success");
						    					});
						    					
						    				});
						    				
						    			});
					    			});

					    		})
					    	}else{
					    		//没有设置基础版本（如果目录中有mainfest直接用那个，兼容旧版本的迁移）
					    		that.checkVersionManifest(backuppath ,function(status){
					    			if(status == false){
					    				//需要创建一个新的版本文件
					    				console.log(">>> 需要创建一个新的版本文件 ：" , backuppath );
					    				var manifest = that.makeManifest(gameid , version  , mode ,function(status){
					    					if(status == false){
					    						callback(0 , "创建一个新的版本文件失败");
					    						return;
					    					}

							    			that.copy2downloadServer(mode, gameid , version , function(status){
					    						if(status==false){
					    							callback(0 , "迭代内容拷贝到下载服失败");
					    							return
					    						}
					    						callback(1 , "success");
					    					});
						    					
						    			})

					    			}else{
					    				//使用附带的版本文件
					    				that.copy2downloadServer(mode, gameid , version , function(status){
				    						if(status==false){
				    							callback(0 , "迭代内容拷贝到下载服失败");
				    							return
				    						}
				    						callback(1 , "success");
				    					});
					    			}
					    		})
					    		
					    	}

			            })
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

//如果基础版本没有配置表使用默认的配置创建一个
gameitems_info.prototype.makeManifest = function(gameid , version , mode, callback){
	//从版本模板拷贝一个
	var model_path = conf.modelPath + "/*" ;
	var backup_path= conf.versionBackup + "/Dev/" + gameid + "/" + version + "/u"
	if(mode == conf.Dis){
		backup_path = conf.versionBackup + "/Dis/" + gameid + "/" + version + "/u"
	}

	utils.doBackup(model_path , backup_path , function(status){
		if(status == false){
			console.log(">>> 复制版本模板到版本失败 "+ backup_path);
			callback(false)
			return;
		}else{
			console.log(">>> 拷贝基础模板成功");
			//修改版本号
			var manifestlist = []
			manifestlist.push(backup_path + "/android/project_dev.manifest")
			manifestlist.push(backup_path + "/android/version_dev.manifest")
			manifestlist.push(backup_path + "/ios/project_dev.manifest")
			manifestlist.push(backup_path + "/ios/version_dev.manifest")

			try{
				for (var i = 0; i < manifestlist.length; i++) {
					var item = manifestlist[i]
					console.log("item:"+ item);
					var manifest = fs.readFileSync( item );
					var manifestObj = JSON.parse(manifest.toString());
					manifestObj.version = version 
					var str = JSON.stringify(manifestObj)
					fs.writeFileSync( item ,str);
				};

				callback(true)
			}catch(e){
				console.log(">>> 修改版本号失败");
				callback(false)
			}
			
		}
	});
}

//检查解压路径下是否有 预配置文件 ./U/
gameitems_info.prototype.checkVersionManifest = function(path, callback){
	//检查单一的android路径
	var android_mani = path + "/u/android/project_dev.manifest"
	fs.exists(android_mani, function(exists){
        if(!exists){
            console.log('>>> checkVersionMainfest not exists.' + android_mani);
            callback(false);
        }else{
          	callback(true);
        }
    });
}

//对于设置了迭代版本的
gameitems_info.prototype.copyBaseVersionManifest = function(gameid , baseVersion , version , zippath , mode,callback){
	console.log(">>> copyBaseVersionManifest ");
	var basepath = conf.versionBackup + "/Dev/" + gameid + "/" + baseVersion + "/u/*"
	var vserpath = conf.versionBackup + "/Dev/" + gameid + "/" + version + "/u"
	if(mode == conf.Dis){
		basepath = conf.versionBackup + "/Dis/" + gameid + "/" + baseVersion + "/u/*"
		vserpath = conf.versionBackup + "/Dis/" + gameid + "/" + version + "/u"
	}

	//基础版本内容的拷贝
	utils.doBackup(basepath , vserpath , function(status){
		if(status == false){
			console.log(">>> 拷贝基础版本更新内容失败");
			callback(false);
			return;
		}

		//拷贝迭代Zip包
		var ulist = [];
		var vkey  = version.replace(/\./g , "_") //utils.replaceAll(version, "." , "_") 
		ulist.push(vserpath + "/android/" + vkey + ".zip");
		ulist.push(vserpath + "/ios/" + vkey + ".zip");
		utils.doBackup2List(zippath , ulist , function(status){
			if(status == false){
				console.log(">>> 拷贝迭代ZIP包内容失败");
				callback(false);
				return;
			}

			//计算ZIP包MD5
			utils.md5file(zippath , function(md5){
				if(md5){
					//计算文件大小
					fs.stat(zippath , function(err , stat){
						if(err){
							console.log(">>> 计算ZIP包大小失败");
							callback(false);
							return;
						}
						var zipsize = stat.size;
						//添加到版本文件中 & 修改版本到最新
						console.log(">>> 添加到版本文件中 & 修改版本到最新");
						var backup_path = conf.versionBackup + "/Dev/" + gameid + "/" + version ;
						if(mode == conf.Dis){
							backup_path = conf.versionBackup + "/Dis/" + gameid + "/" + version ;
						} 
						var manifestlist = []
						manifestlist.push(backup_path + "/u/android/project_dev.manifest")
						manifestlist.push(backup_path + "/u/android/version_dev.manifest")
						manifestlist.push(backup_path + "/u/ios/project_dev.manifest")
						manifestlist.push(backup_path + "/u/ios/version_dev.manifest")

						try{
							for (var i = 0; i < manifestlist.length; i++) {
								var item = manifestlist[i]
								//
								var manifest = fs.readFileSync( item );
								var manifestObj = JSON.parse(manifest.toString());
								manifestObj.version = version
								if(manifestObj.assets){
									var sort = 0
									Object.keys(manifestObj.assets).forEach(function(key){
										console.log(key);
										var itemsort = parseInt(manifestObj.assets[key].sort_index)
										if( itemsort > sort ){
											sort = itemsort;
										}
									});

									console.log(">>> ADD assets " + item);
									var obj = {}
									obj.sort_index = String(sort + 1);
									obj.compressed = true;
									obj.check_md5  = md5;
									obj.size = zipsize;
									manifestObj.assets[vkey + ".zip"] = obj;

								} 
								var str = JSON.stringify(manifestObj)
								fs.writeFileSync( item ,str);
							};

							callback(true)
						}catch(e){
							console.log(">>> 修改版本号失败" + e);
							callback(false)
						}
					});

				}else{
					console.log(">>> 计算ZIP包MD5失败");
					callback(false);
				}
			})
			

		})


	})
	
}

gameitems_info.prototype.scriptEncrypt = function(path ,callback){
	utils.renameExtent(path , ".lua" ,".luac" , callback )
}


//删除版本
gameitems_info.prototype.deleteVersion = function(mode,gameid,version,callback){
	var game_path = conf.gameDevDir + "/" + gameid + "/" + version ;
	if(mode == conf.Dis){
		game_path = conf.gameDisDir + "/" + gameid + "/" + version ;
	} 

	utils.delete(game_path , function(status){
		if(status == false){
			callback(0,"删除版本失败");
			return
		}

		callback(1,"success");
	})
}

//拷贝到资源服务目录下 game
gameitems_info.prototype.copy2downloadServer = function(mode , gameid , version ,callback){
	var backuppath = conf.versionBackup + "/Dev/" + gameid + "/" + version + "/u";
	var gamepath   = conf.gameDevDir + "/" + gameid + "/" + version;
	if(mode == conf.Dis){
		backuppath = conf.versionBackup + "/Dis/" + gameid + "/" + version + "/u";
		gamepath   = conf.gameDevDir + "/" + gameid + "/" + version;
	}

	utils.doBackup(backuppath +"/*" , gamepath +"" , callback);
}

const gameitems = new gameitems_info()
module.exports = gameitems