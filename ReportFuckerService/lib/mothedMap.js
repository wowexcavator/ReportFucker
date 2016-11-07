function mothedMap(){
	//登陸方法
	this.f_login=function(request, response){
		response.write('登陆时代放假啦空手道解放立刻集散地立刻反击');
		request.session.state='login';
	}
	//注冊
	this.f_regist=function(request, response){
		
	}
	//登陸方法
	this.f_editpass=function(request, response){
		
	}
	//退出方法
	this.f_logout=function(request, response){
		
	}
	//根据日期获取数据
	this.f_getListByDate=function(request, response){
		
	}
	//获取设置信息
	this.f_getSetInfo=function(request, response){
		
	}
	//设置邮箱信息
	this.f_setEmailInfo=function(request, response){
		
	}
	//测试邮箱
	this.f_testEmail=function(request, response){
		
	}
	//设置报表发送时间
	this.f_setReportTimer=function(request, response){
		
	}
	//增加自动填充任务
	this.f_addAutoTask=function(request, response){
		
	}
}
module.exports = new mothedMap();