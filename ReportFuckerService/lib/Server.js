var http = require('http');
var url = require('url');
var route = require('./route.js');
var EXPIRES =30 * 24 * 60 * 60 * 1000;//過期時間一個月
http.createServer(function(request, response) {
	//response.writeHead(200,{'Content-Type': 'application/json'});

	//获取cookie\
	request.cookies = paeseCookie(request.headers.cookie);
	var sessions = {};
	var key = 'session_id';
	var id = request.cookies[key];
	if(!id) {
		request.session = generate();
	} else {
		var session = sessions[id];
		if(session) {
			if(session.cookie.expire > (new Date()).getTime()) {
				session.cookie.expire = (new Date()).getTime() + EXPIRES;
				request.session = session;
			} else {
				delete session[id];
				request.session = generate();
			}
		} else {
			request.session = generate();
		}
	}
	var writeHead = response.writeHead;
	response.writeHead = function() {
			var cookies = response.getHeader(key);
			var session = serialize(key, request.session.id);

			cookies = Array.isArray(cookies) ? cookies.concat(session) : [cookies, session];
			console.log(generate());
			var t=generate().cookie;
			response.setHeader('Set-Cookie',t['session_id'],'expires='+new Date(t.expires).toGMTString());
			//保存会缓存 
			
			return writeHead.apply(this, arguments);
		}
		response.writeHead(200, {
		'Content-Type': 'text/plain'
	});
		//解析路径并传给路由
	var path = url.parse(request.url).pathname.split('/').pop();
	route.exec(path, request, response);
	response.end(function() {
		//在这儿设置cookie     
		//如果cookie过期
	});
}).listen(8888);

setTimeout(function() {
	process.exit();
}, 30000);
//生成一個新的session值
function generate() {
	var session = {};
	session.id = (new Date()).getTime() + Math.random();
	session.cookie = {
		expires: (new Date()).getTime() + EXPIRES,
		'session_id':session.id
	};
	return session;
}
//解析cookie
function paeseCookie(cookie) {
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

function serialize(name, val, opt) {
	var pairs = [name + '=' + val];
	opt = opt || {};
	if(opt.maxAge) pairs.push('Max-Age=' + opt.maxAge);
	if(opt.domain) pairs.push('Domain=' + opt.domain);
	if(opt.path) pairs.push('Path=' + opt.path);
	if(opt.exoires) pairs.push('Expires=' + opt.expires.toUTCString());
	if(opt.httpOnly) pairs.push('HttpOnly');
	if(opt.secure) pairs.push('Secure');
	return pairs.join(';');
}