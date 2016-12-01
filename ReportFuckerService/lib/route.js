var mothed=require('./mothedMap.js');
var logModel=require('./LogSchema.js');
function route() {
	//路由对照表
	this.routetable = {
			'login': mothed.f_login,
			'regist': mothed.f_regist,
			'editpass': mothed.f_editpass,
			'logout': mothed.f_logout,
			'getListByDate': mothed.f_getListByDate,
			'getSetInfo': mothed.f_getSetInfo,
			'setEmailInfo': mothed.f_setEmailInfo,
			'testEmail': mothed.f_testEmail,
			'setReportTimer': mothed.f_setReportTimer,
			'addAutoTask': mothed.f_addAutoTask,
			'getAutoTask':mothed.f_getAutoTask,
			'deleteTcTask':mothed.f_deleteTcTask, 
			'addTask':mothed.f_addTask,
			'deleteTask':mothed.f_deleteTask,
			'getAutoTask':mothed.f_getAutoTask,
			'updateTask':mothed.f_updateTask,
		}
		//执行对应的方法
	this.exec = function(path, request, response,param,userlist) {
		//添加日志
		var log=new logModel({
			name:path,
			time:new Date().getTime(),
			'param':JSON.stringify(param)
		});
		if(request.sesssion!=null&&request.session.userid!=null){
			log.userid=request.session.userid;
		}
		log.save();//写入日志
		if(this.routetable[path] != null) {
			this.routetable[path](request, response,param,userlist); //执行对应的方法
		} else {
			response.write('{state:false,msg:"no mothed"}');
			response.end();
		}
	}
}
module.exports = new route();