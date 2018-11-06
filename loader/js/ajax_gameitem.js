/**
 * navbar-ontop.js 1.0.0
 * Add .navbar-ontop class to navbar when the page is scrolled to top
 * Make sure to add this script to the <head> of page to avoid flickering on load
 */
function getParams(key) {
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)"); 
   //如果地址栏中出现中文则进行编码    
    var r = encodeURI(window.location.search).substr(1).match(reg);  
    if (r != null) {  
        //将中文编码的字符重新变成中文
        return decodeURI(unescape(r[2]));  
    }  
    return null;  
};

function intUI(){
    var game = getParams('game');
    var name = getParams('name');
    var icon = getParams('icon');
    var mode = getParams('mode');
    console.log(game + name +icon );
    this.gameid = game;
    this.mode = mode;
    window.onload = function(){
      document.getElementById("gamemsg").innerHTML  = game ;
      document.getElementById("gamename").innerHTML = name ;
      document.getElementById("gameicon").src = "./icons/" + icon
    }

    getGameVersions()
}

function createNewVersion(){
  // alert(">>> 暂时 <<<");
  $('#myModal').modal('show')
}

function editversion(version){
  alert(">>> 暂时 <<<" + version);
}

function deleteVersion(version){
    var xmlhttp;
    if (window.XMLHttpRequest)
    {
        //  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
        xmlhttp=new XMLHttpRequest();
    }
    else
    {
        // IE6, IE5 浏览器执行代码
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
          var respones_ = xmlhttp.responseText;
          if(respones_){
              var data = JSON.parse(respones_);
              if(data){
                if(data.code == 1){
                  //刷新UI
                  getGameVersions()
                  //提示
                  alert("删除版本成功!\n(如果是误删除立刻联系管理员!)");
                  return
                }else{
                  alert("操作失败:" + data.msg);
                }
                
              }else{
                showAlert(true,"失败无数据返回",3000)
              }
          } 
        }
    }
    xmlhttp.open("GET","/delete?mode="+ this.mode + "&gameid=" + this.gameid + "&version=" + version ,true);
    xmlhttp.send();     
}

//游戏的版本列表
function getGameVersions(){
    var xmlhttp;
    if (window.XMLHttpRequest)
    {
        //  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
        xmlhttp=new XMLHttpRequest();
    }
    else
    {
        // IE6, IE5 浏览器执行代码
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
          var respones_ = xmlhttp.responseText;
          if(respones_){
            const list_ = JSON.parse(respones_);
            console.log(list_);
            var context_ = "";
            var select_versions = ""
            if(list_){
              for (var i = 0; i < list_.length; i++) {
                var item_ = list_[i]
                if(item_ && item_.type== "dir"){
                  var value = item_.value;
                  // context_ += "<a href=\"#\" class=\"list-group-item list-group-item-action\" onclick=\"editversion()\" > version "+ value+" </a>";
                  context_ = context_ + '<div class="list-group-item list-group-item-action">                                               '   
                                      + '  <div class="row">                                                                                '   
                                      + '    <div class="col-md-11">                                                                        '
                                      + '      <a href="#" class="version_edit" onclick="editversion(\'' + value+ '\')" > version '+ value +' </a>          '    
                                      + '    </div>                                                                                         ' 
                                      + '    <div class="col-md-1">                                                                         '   
                                      + '      <a href="#" class="version_dele" onclick="deleteVersion(\'' + value+ '\')" > 删除 </a>                        '              
                                      + '    </div>                                                                                         '
                                      + '  </div>                                                                                           '     
                                      + '</div>                                                                                             '     
                  
                  select_versions += "<a class=\"dropdown-item\" href=\"#\" onclick=\"selectVesion('"+ value +"')\">"+ value+ "</a>";
                }
              };
            }
          }else{
            context_ += "<p class=\"lead\">.没有版本内容.</p>"
          }
          document.getElementById("versions_list").innerHTML = context_;
          document.getElementById("version_select").innerHTML = select_versions;
        }
    }
    xmlhttp.open("GET","/gameversions?mode="+ this.mode + "&gameid=" + this.gameid,true);
    xmlhttp.send();
}

//游戏版本详情
function getGameVersionDetail(){

}

function selectVesion(version){
  if(version){
    document.getElementById("base_version").innerHTML = version;
    document.getElementById("base_version").value = version;
  }
}

function createVersion(){
  var version  = document.getElementById("input_version").value ;
  var baseVersion  = document.getElementById("base_version").value;

  if(version){
    //发送给服务器注册
    if (version == baseVersion) {
      showAlert(true,"不能重复创建版本!!!",3000)
      return ;
    };
    var oData = new FormData(document.forms.namedItem("fileinfo"));
    oData.append("version",version);
    oData.append("baseVersion",baseVersion);
    oData.append("gameid",this.gameid);
    oData.append("mode",this.mode);

    var xmlhttp;
      if (window.XMLHttpRequest)
      {
          //  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
          xmlhttp=new XMLHttpRequest();
      }
      else
      {
          // IE6, IE5 浏览器执行代码
          xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
      }
      xmlhttp.onreadystatechange=function()
      {
          if (xmlhttp.readyState==4 && xmlhttp.status==200)
          {    
            closeLoading("vermgrloading")
            var respones_ = xmlhttp.responseText;
            if(respones_){
              var data = JSON.parse(respones_);
              if(data){
                if(data.code == 1){
                  $('#myModal').modal('hide')
                  //刷新UI
                  getGameVersions()
                  //提示
                  showAlert(false,"创建成功!!!",3000)
                  return
                }else if(data.code == 2){
                  document.getElementById("version_prgress").style = "width: " + data.msg + "%;"
                  document.getElementById("version_prgress_txt").innerHTML = data.msg + "%"
                }else{
                  showAlert(true,data.msg,3000)
                }
                
              }else{
                showAlert(true,"失败无数据返回",3000)
              }
            }
          }
      }

      xmlhttp.open("post","../uploadVersion",true);
      xmlhttp.send(oData);
      showLoading("处理版本中请稍后!!!")
    
  }else{
    showAlert(true,"游戏版本等信息不能为空!!!",3000)
  }
}

function showAlert(isModal,msg,timeout){
  if(msg){
    if(isModal == true){
      document.getElementById("modal_alert").innerHTML = "<div class=\"alert alert-danger\" role=\"alert\"> "+ msg +" <a href=\"#\" class=\"close\" data-dismiss=\"alert\">x</a></div>";
    }else{
      document.getElementById("msg_alert").innerHTML = "<div class=\"alert alert-success\" role=\"alert\"> "+ msg +" <a href=\"#\" class=\"close\" data-dismiss=\"alert\">x</a></div>";
    }

    if(timeout && timeout >0){
      setTimeout(function() {
        if(isModal == true){
          document.getElementById("modal_alert").innerHTML = ""
        }else{
          document.getElementById("msg_alert").innerHTML = ""
        }
      }, timeout);
    } 
  }
}

function showLoading(msg){
  $('body').loading({
      loadingWidth:240,
      title:'',
      name:'vermgrloading',
      discription:msg,
      direction:'column',
      type:'origin',
      // originBg:'#71EA71',
      originDivWidth:40,
      originDivHeight:40,
      originWidth:6,
      originHeight:6,
      smallLoading:false,
      loadingMaskBg:'rgba(0,0,0,0.2)'
    });
}
function closeLoading(loadingName){
  var loadingName = loadingName || '';
  $('body,html').css({
    overflow:'auto',
  });

  if(loadingName == ''){
    $(".cpt-loading-mask").remove();
  }else{
    var name = loadingName || 'loadingName';
    $(".cpt-loading-mask[data-name="+name+"]").remove();    
  }
}

function setFormUpload(){
    //upload file
  //   $("#file_input").fileinput({
  //     language : 'zh',
  //     showUpload: false, //是否显示上传按钮
  //     showCancel: false,
  //       uploadUrl: '/uploadVersion', // you must set a valid URL here else you will get an error
  //       allowedFileExtensions : ['zip', 'rar','tar'],
  //       overwriteInitial: false,
  //       maxFileSize: 1000000,
  //       maxFilesNum: 1,
  //       //allowedFileTypes: ['image', 'video', 'flash'],
  //       slugCallback: function(filename) {
  //           return filename.replace('(', '_').replace(']', '_');
  //       }
  // });
 
};

