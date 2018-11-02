const fs = require("fs");
const exec = require("child_process").exec
const conf = require("./../conf/config");

function utils(){
	
}

Date.prototype.format = function(fmt){
	var o = { 
        "M+" : this.getMonth()+1,                 //月份 
        "d+" : this.getDate(),                    //日 
        "h+" : this.getHours(),                   //小时 
        "m+" : this.getMinutes(),                 //分 
        "s+" : this.getSeconds(),                 //秒 
        "q+" : Math.floor((this.getMonth()+3)/3), //季度 
        "S"  : this.getMilliseconds()             //毫秒 
    }; 
    if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
    }
     for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
             fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
         }
     }
    return fmt; 
}


utils.prototype.unzip = function(zippath, unzipdir ,callback){
    var cmdmk = "mkdir -p "+ unzipdir ;
    exec(cmdmk,function(err,stdout,stderr){  //执行创建文件夹命令行
        if(err){
            console.log(">>> 创建备份目录失败");
            callback(false);
        }else{
            console.log(">>> 创建备份目录成功");
            // callback(true);
            var cmd = "unzip -q -o "+ zippath + " -d " + unzipdir
            console.log(">>>  unzip cmd :" + cmd);
            exec(cmd,function(err,stdout,stderr){  //执行命令行
                if(err){
                    console.log(">>> 解压失败" + stderr + err );
                    callback(false);
                }else{
                    console.log(">>> 解压成功");
                    callback(true);
                }
            });
        }
    });
}

utils.prototype.zip = function(targetpath , zippath ,callback){
    var cmd = "zip " + targetpath + " " + zippath;
    exec(cmd,function(err,stdout,stderr){  //执行命令行
        if(err){
            console.log(">>> 压缩文件失败" + err + stderr );
            callback(false);
        }else{
            console.log(">>> 压缩文件成功");
            callback(true);
        }
    });
}


utils.prototype.doBackup = function(unzipdir , backup , callback){
    var cmd = "mkdir -p "+ backup + "; cp -R " + unzipdir + "/* " + backup
    exec(cmd,function(err,stdout,stderr){  //执行命令行
        if(err){
            console.log(">>> 复制 失败");
            callback(false);
        }else{
            console.log(">>> 复制 成功");
            callback(true);
        }
    });
}

utils.prototype.cleanDir = function(dir , callback){
    var cmd = "rm -rf "+ dir + "/*"
    console.log(">>> cleanDir " + cmd);
    exec(cmd,function(err,stdout,stderr){  //执行命令行
                if(err){
                    console.log(">>> 清除目录 失败");
                    callback(false)
                }else{
                    console.log(">>> 清除目录 成功");
                    callback(true)
                }
            });
}

utils.prototype.compareDir = function(baseDir , newDir,  temppath ,callback){
    var cmd = "python ./pythons/comparer.py " + baseDir + " " + newDir + " " + temppath
    console.log(">>> compareDir " + cmd);
    exec(cmd,function(err,stdout,stderr){  //执行命令行
                if(err){
                    console.log(">>> 比对命令失败" + err + stderr );
                    callback(false)
                    return 
                }

                console.log(">> python Log ：" + stdout);
                callback(true)
            });
}

utils.prototype.checkZipContents = function(zipdir , callback){
    //检查解压出来的内容是否完整
    //src 、res 、 .apk  、 .ipa
}

utils.prototype.readDirSync = function(path){
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

const utils_ = new utils()
module.exports = utils_