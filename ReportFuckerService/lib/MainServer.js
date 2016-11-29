var http=require('http');
var url=require('url');
var qs=require('querystring');
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
 	session.id=sessionid;
 	 	if(request.cookies['expires']!=null&&request.cookies['expires']!=''){
 	 		session.cookie={
			 	id:sessionid,
			 	expires:GMTtoS(request.cookies['expires'])
			};

 	 	}else{
 	 		session.cookie={
			 	id:sessionid,
			 	expires:(new Date()).getTime()+145644
			};
 	 	}

 	if(!sessionid){//不存在sessionid
 		request.session=generate();//生成 新的session
 		sessionList.push(request.session);
 	}else{//存在sessionid
 		//判断sessionid是否过期
 		if(session.cookie.expires>(new Date()).getTime()){//没过期
 				session.cookie.expires =(new Date()).getTime() + EXPIRES;
 				var obj=findsession(sessionid);
 				if(obj){
 					obj.cookie.expires=session.cookie.expires;
 				}
 		}else{
 			var obj=findsession(sessionid);
 			if(obj){
 				obj.userid=null;
 				sessionid='';
 			}
 		}
 		//判断是否是已经存在sessionid
 		var obj=findsession(sessionid);
 		if(obj){
 			request.session=obj;
 		}else{
 			request.session=generate();//生成 新的session
 			sessionid=request.session.id;
 			sessionList.push(request.session);
 		}
 	}
 		//替换头写入函数
 	var writeHead = response.writeHead;
 		response.writeHead = function(){
			response.setHeader('Set-Cookie','session_id='+request.session.cookie.id+';expires='+sToGMT(request.session.cookie.expires));
			return writeHead.apply(this, arguments);
		}
 		response.writeHead(200, {
			'Content-Type': 'text/plain;charset=UTF-8'
		});
 		//解析路径并传给路由
	var path = url.parse(request.url).pathname.split('/').pop();
	//监听post
	var post='';
	 request.on('data', function(chunk){    //通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
        post += chunk;
    });

    request.on('end', function(){    //在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
        post = qs.parse(post);
        route.exec(path, request, response,post);
    });

 	
 }).listen(8888);
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
		id:session.id,
		expires: (new Date()).getTime() + EXPIRES
	};
	//session[session.id] = session;
	return session;
}
//session对象管理
function findsession(id){
	if(id){
		for(var i=0;i<sessionList.length;i++){
			if(id==sessionList[i].id){
				return sessionList[i];
			}
		}
		return null;
	}
}
//sessionList定时清理
setInterval(function(){
	if(sessionList&&sessionList.length>0){
		for(var i=0;i<sessionList.length;i++){
			if(sessionList[i].userid==null){//如果session没有对应的userid
				sessionList.splice(i,1);//删除该项
			}
		}
	}
},1000);

//毫秒值转gmt时间
function sToGMT(s){
	try{
		return (new Date(s)).toGMTString();
	}catch(error){
		return '';
	}
}
//gmt时间转毫秒值
function GMTtoS(s){
	try{
		return (new Date(s)).getTime();
	}catch(error){
		return '';
	}
}
//setTimeout(function() {
//	process.exit();
//}, 30000);