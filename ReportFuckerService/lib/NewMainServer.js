var http = require('http');
var url = require('url');
var qs = require('querystring');
var route = require('./route.js');
//令牌过期时间
var EXPIRES = 7 * 24 * 60 * 60 * 1000;
//cookie中存储的值名称
var key = 'userKey';
//ActiveUserList； 
var activeUserList = [];
//DBcontent
var mongoose = require("mongoose"),
	DB_URL = require('./ServerConfig.js').DB_URL;
mongoose.connect(DB_URL);
//创建服务
http.createServer(function(request, response) {
	//替换头写入函数
	var writeHead = response.writeHead;
	response.writeHead = function() {
		response.setHeader('Access-Control-Allow-Origin', '*');
		return writeHead.apply(this, arguments);
	}
	response.writeHead(200, {
		'Content-Type': 'application/json'
	});
	//解析路径并传给路由charset=UTF-8
	var path = url.parse(request.url).pathname.split('/').pop();
	//监听post
	var post = '';
	request.on('data', function(chunk) { //通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
		post += chunk;
	});

	request.on('end', function() { //在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
		post = qs.parse(post);
		//判断令牌
		if(post!=null&&post.key!=null){
			//验证令牌的有效性
			if(checkKey(post.key,request)){
				route.exec(path, request, response, post,activeUserList);
			}else{
				response.write('{"state":"false","login":"noAccess"}');
				response.end();	
			}
		}else{
			if(path.indexOf('login')>-1){
				//生成新的令牌
				route.exec('login', request, response, post,activeUserList);
			}else{
				response.write('{"state":"false","login":"noAccess"}');
				response.end();	
			}
		}
		
	});

}).listen(8888);

//验证令牌的有效性
function checkKey(key,request){
	for(var i=0;i<activeUserList.length;i++){
		var node=activeUserList[i];
		if(node.key==key){
			//如果没有过期
			if(node.lastDate>new Date().getTime()){
				node.lastDate=new Date().getTime()+EXPIRES;
				request.session=node;
				return true;
			}else{
				activeUserList.splice(i,1);//删除该项
				return false;
			}
		}
	}
	return false;
}

//令牌数量控制
setInterval(function(){
	var t={};
	for(var i=0;i<activeUserList.length;i++){
		var node=activeUserList[i];
		if(t[node.userid]){
			t[node.userid].push(node);
		}else{
			t[node.userid]=[];
			t[node.userid].push(node);
		}
	}
	for(var  i in t){
		if(t[i].length>4){//如果客户端数量大于4
			while(t[i].length>4){
				var node=t[i].shift();
				deleteSession(node.key);
			}
		}
	}
},1000*10);

//deletesession
function deleteSession(key){
	for(var i=0;i<activeUserList.length;i++){
		if(activeUserList[i].key==key){
			activeUserList.splice(i,1);
			break;
		}
	}
}
