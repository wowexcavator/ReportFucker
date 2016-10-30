var http=require('http');
var url=require('url');
var route=require('./route.js');
//session過期時間
var EXPIRES = 30*24*60*60*1000;
//cookie中存储的值名称
var key='session_id';
//sessionList  
var sessionList=[];
//創建服務
 http.createServer(function(request,response){
 	var session={};
 	//获取cookie信息
 	request.cookies=parseCookie(request.headers['cookie']);
 	//根据sessionid判断用户信息
 	var sessionid=request.cookies[key];
 	if(!sessionid){
 		request.session=generate();//生成心的session
 	}else{
 		
 	}
 });
//解析cookie
function parseCookie(cookie) {
	var cookies = {};
	if(!cookie) {
		return cookies;
	}
	var list = cookie.split(';');
	for(var i = 0; i < list.length; i++) {
		var pair = list[i].split('=');
		cookies[pair[0].trim()] = pair[1];
	}
	return cookies;
}
//生成一個新的session值
function generate() {
	var session = {};
	session.id = (new Date()).getTime() + (Math.random()*100).toFixed(0);
	session.cookie = {
		expires: (new Date()).getTime() + EXPIRES
	};
	session[session.id] = session;
	return session;
}