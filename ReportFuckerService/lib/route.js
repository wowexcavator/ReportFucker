var mothed=require('./mothedMap.js');
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
		}
		//执行对应的方法
	this.exec = function(path, request, response) {
		if(this.routetable[path] != null) {
			this.routetable[path](request, response); //执行对应的方法
		} else {
			response.write('{state:false,msg:"no mothed"}');
		}
	}

}
module.exports = new route();