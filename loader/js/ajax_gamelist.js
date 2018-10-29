/**
 * navbar-ontop.js 1.0.0
 * Add .navbar-ontop class to navbar when the page is scrolled to top
 * Make sure to add this script to the <head> of page to avoid flickering on load
 */
var uiShowMode = "dis"
function requestGamelist(mode)
{
	uiShowMode = mode;//
	console.log(">>>>> requestGamelist ",mode);
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
       			if(list_){
       				for (var i = 0; i < list_.length; i++) {
       					if(i == 0){
       						//add 
       						context_ += "<div class=\"row pb-4\">";
       					}
       					if(i%4 == 0){
       						//add end
       						context_ += "</div><div class=\"row pb-4\">";
       					}
       					var item  = list_[i];
       					var parme = encodeURI("game=" +item.id + "&name="+ item.name+ "&icon="+ item.icon)
       					console.log(">>>> parme "+ parme);
       					context_  =  context_ + "<div class=\"col-md-3\"> " 
       										 +		"<div class=\"card\"> "
       										 +			"<img class=\"card-img-top\" src=\"/icons/"+ item.icon+"\" height=240px alt=\"Card image cap\">"
       										 +			"<div class=\"card-body bg-warning\">"
       										 +				"<h5 class=\"card-title\">"+ item.name+"</h5>"
       										 +				"<p class=\"card-text\">创建时间:" +item.time+"</p>"
       										 +				"<a href=\"gameitem.html?"+ parme + "\" class=\"btn btn-dark btn-block\">查看版本</a>"
       										 +			"</div>"
       										 +		"</div>"
       										 +	"</div>";
       				};

       				context_ += "</div>";
       			}
       		}
        	document.getElementById("gamelist_container").innerHTML = context_;
      	}
    }
    xmlhttp.open("GET","/gamelist?mode="+ mode,true);
    xmlhttp.send();
};

function selectGameMode(mode){
	// if(mode == "dev"){
	// 	document.getElementById("id_gamemode").innerHTML = "开发版";
	// 	document.getElementById("id_gamemode").value = "dev"
	// }else{
	// 	document.getElementById("id_gamemode").innerHTML = "正式版";
	// 	document.getElementById("id_gamemode").value = "dis"
	// }

}

function createGame(){
	var name 	= document.getElementById("input_name").value ;
	var gameid  = document.getElementById("input_gameid").value;
	// var mode = document.getElementById("id_gamemode").value;
	// console.log(">>> modal mode select :",mode);
	var mode_ 
	var radios = document.getElementsByName("mode_radio")
	if(radios){
		for (var i = 0; i < radios.length; i++) {
			if(radios[i].checked){
				mode_ = radios[i].value
				console.log(">>>>>> "+ radios[i].value);
			}
		};
	}

	if(name && gameid && mode_){
		//发送给服务器注册

		var oData = new FormData(document.forms.namedItem("fileinfo"));
		oData.append("CustomField","This is some extra data");
		oData.append("gameid",gameid);
		oData.append("name",name);
		oData.append("mode",mode_);

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
	       			if(data && data.code == 1){
	       				$('#myModal').modal('hide')
	       				//刷新UI
	       				requestGamelist(uiShowMode)
	       				//提示
	       				showAlert(false,"创建成功!!!",3000)
	       				return
	       			}


	       		}
	      	}
	    }
	    // console.log('>>> url ', "/createitem?mode="+ mode+ "&name="+ name+"&gameid=" +gameid);
	    // xmlhttp.open("GET","/createitem?mode="+ mode+ "&name="+ name+"&gameid=" +gameid ,true);
	    // xmlhttp.send();

	    xmlhttp.open("post","../upload",true);
        xmlhttp.send(oData);
		
	}else{
		showAlert(true,"游戏名、游戏编号、版本等信息不能为空!!!",3000)
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

function setFormUpload(){
    //upload file
    $("#file_input").fileinput({
    	language : 'zh',
    	showUpload: false, //是否显示上传按钮
    	showCancel: false,
        uploadUrl: '/upload', // you must set a valid URL here else you will get an error
        allowedFileExtensions : ['jpg', 'png','gif'],
        overwriteInitial: false,
        maxFileSize: 10000,
        maxFilesNum: 1,
        //allowedFileTypes: ['image', 'video', 'flash'],
        slugCallback: function(filename) {
            return filename.replace('(', '_').replace(']', '_');
        }
	});
 
};
