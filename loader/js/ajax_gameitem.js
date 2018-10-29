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
    console.log(game + name +icon );
 
    window.onload = function(){
      document.getElementById("gamemsg").innerHTML  = game ;
      document.getElementById("gamename").innerHTML = name ;
      document.getElementById("gameicon").src = "./icons/" + icon
    }
}

function createNewVersion(){
  alert(">>> 暂时 <<<");
}