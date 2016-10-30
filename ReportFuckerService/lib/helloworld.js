var http=require('http');

http.createServer(function(request,response){
	response.writeHead(200,{'Content-Type': 'text/plain'});
	response.end('hello world');
}).listen(8888);
setTimeout(function(){
	process.exit();
},10000);
console.log('server running at http:127...');
