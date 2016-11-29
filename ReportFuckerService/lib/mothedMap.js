var userModel = require('./Mongodb.js');
var mongoose=require("mongoose");
function mothedMap() {

	//登陸方法
	this.f_login = function(request, response, param) {
		param={
			name:'tttt',
			pass:'1111'
		};
			if(param != null && param.name != null && param.name != '') {
				var user = userModel.find({
					name: param.name
				}, function(err, res) {
					if(err) {
						response.write('{state:"false"}');
						console.log('login_db_err');
						response.end();
						return false;
					} else {
						var tuser=res[0];
						if(param.pass != null && param.pass == tuser.pass) { //登陆成功
							request.session.userid = tuser._id.toString();
							response.write('{state:"succcess",msg:"登陆成功"}');
							response.end();
							return true;
						} else {
							response.write('{state:"false",msg:"密码错误"}');
							response.end();
							return false;
						}
					}
				});
			} else {
				response.write('{state:"false"}');
				response.end();
				return false;
			}

		}
		//注冊
	this.f_regist = function(request, response, param) {
		if(param != null) {
				if(param.name == null || param.name == '') {
					response.write('{state:"false",msg:"用户名不能为空"}');
					response.end();
					return false;
				}
				if(param.pass == null || param.pass == '') {
					response.write('{state:"false",msg:"密码不能为空"}');
					response.end();
					return false;
				}
				if(param.email == null || param.email == '') {
					response.write('{state:"false",msg:"邮箱不能为空"}');
					response.end();
					return false;
				}
				//数据库操作
					userModel.find({
						'name': param.name
					}, function(err, res) {
						if(err) {
							response.write('{state:"false"}');
							response.end();
							return false;
						} else {
							if(res.length>0) {
								response.write('{state:"false",msg:"用户名已经被注册了"}');
								response.end();
								return false;
							} else {
								var user = new userModel({
									name:param.name,
									pass:param.pass,
									registemail:param.email,
									createtime:new Date().getTime(),
								});
								//保存用户
								user.save(function(err,res,na){
									if(err){
										response.write('{state:"false"}');
										response.end();
										return false;
									}else{
										if(na>0){
											response.write('{state:"succcess",msg:"注册成功"}');
											response.end();
											return true;
										}
									}
								});
							}
						}
					});

			}
		}
		//修改密码
	this.f_editpass = function(request, response, param) {
			if(param){
				if(param.oldpass==null||param.oldpass==''){
					response.write('{state:"false",msg:"原密码不能为空"}');
					response.end();
					return false;
				}
				if(param.newpass==null||param.newpass==''){
					response.write('{state:"false",msg:"新密码不能为空"}');
					response.end();
					return false;
				}
				userModel.find({_id:request.session.userid},function(err,res){
					if(err){
						response.write('{state:"false"}');
						response.end();
						return false; 
					}else{
						if(res.length>0){
							if(res[0].pass==param.oldpass){
								userModel.findByIdAndUpdate(request.session.userid,{pass:param.newpass},function(err,res){
								if(err){
									response.write('{state:"false"}');
									response.end();
									return false;
								}else{
									if(res){
										response.write('{state:"success",msg:" 密码修改成功！"}');
										request.session.userid=null;//注销掉登录状态
										response.end();
										return false;
									}
								}
							});
							}else{
								response.write('{state:"false",msg:"密码不匹配"}');
								response.end();
								return false;
							}

						}else{
							response.write('{state:"false"}');
							response.end();
							return false;
						}
					}
				});
				
			}else{
				response.write('{state:"false"}');
				response.end();
				return false;
			}
		}
		//退出方法
	this.f_logout = function(request, response) {
				response.write('{state:"success",msg:" 退出成功！"}');
				request.session.userid=null;//注销掉登录状态
				response.end();
				return false;		
		}
		//根据日期获取数据
	this.f_getListByDate = function(request, response,param) {
			if(param){
				if(param.date!=null){
					userModel.findById(request.session.userid).pr;
				}
			}else{
				response.write('{state:"false",msg:"参数为空"}');
				response.end();
				return false;		
			}
		}
		//获取设置信息
	this.f_getSetInfo = function(request, response) {
			
		}
		//设置邮箱信息
	this.f_setEmailInfo = function(request, response,param) {
			if(param){
				var updateObj={};
				var state=true;
				if(param.sendfrequency){
					updateObj.sendfrequency=param.sendfrequency;
					state=false;
				}
				if(param.sendday){
					updateObj.sendday=param.sendday;
					state=false;
				}
				if(param.sendhour){
					updateObj.sendhour=param.sendhour;
					state=false;
				}
				if(param.sendmine){
					updateObj.sendmine=param.sendmine;
					state=false;
				}
				if(state){
					response.write('{state:"success",msg:"设置报表发送事件成功"}');
					response.end();
					return false;
				}
				userModel.findByIdAndUpdate (request.session.userid,updateObj,function(err,res){
					if(err){
						response.write('{state:"false"}');
						response.end();
						return false;
					}else{
						response.write('{state:"success",msg:"设置报表发送事件成功"}');
						response.end();
						return false;
					}
				})
			}else{
				response.write('{state:"false"}');
				response.end();
				return false;
			}
		}
		//测试邮箱
	this.f_testEmail = function(request, response) {
			
		}
		//设置报表发送时间
	this.f_setReportTimer = function(request, response,param) {
			if(param){
				var updateObj={};
				if(param.sendfrequency){
					updateObj.sendfrequency=param.sendfrequency;
				}
				if(param.sendday){
					updateObj.sendday=param.sendday;
				}
				if(param.sendhour){
					updateObj.sendhour=param.sendhour;
				}
				if(param.sendmine){
					updateObj.sendmine=param.sendmine;
				}
				userModel.findByIdAndUpdate (request.session.userid,updateObj,function(err,res){
					if(err){
						response.write('{state:"false"}');
						response.end();
						return false;
					}else{
						response.write('{state:"success",msg:"设置报表发送事件成功"}');
						response.end();
						return false;
					}
				})
			}else{
				response.write('{state:"false"}');
				response.end();
				return false;
			}
		}
		//增加自动填充任务
	this.f_addAutoTask = function(request, response,param) {
		if(param){
			userModel.findById(request.session.userid).exec(function(err,res){
				if(err){
					response.write('{state:"false"}');
					response.end();
					return false;
				}else{
					if(res.task!=null){
						res.tclist.push({
							id:mongoose.Types.ObjectId(),
							createtime:new Date().getTime(),
							content:param.content,
						});
						res.save(function(err,res){
							if(err){
								response.write('{state:"false"}');
								response.end();
								return false;
							}else{
								response.write('{state:"success",msg:"添加自动填充任务成功"}');
								response.end();
								return false;
							}
						});
					}
				}
			});
		}else{
			response.write('{state:"false"}');
			response.end();
			return false;
		}
	}
	//增加任务
	this.f_addTask=function(request,response,param){
		if(param){
			userModel.findById(request.session.userid).exec(function(err,res){
				if(err){
							response.write('{state:"false"}');
							response.end();
							return false;
				}else{
					if(res.task!=null){
						res.task.push({
							id:mongoose.Types.ObjectId(),
							createtime:new Date().getTime(),
							date:param.date,
							content:param.content,
							state:'undone',
							
						});
						res.save(function(err,res){
							if(err){
								response.write('{state:"false"}');
								response.end();
								return false;
							}else{
								response.write('{state:"success",msg:"添加任务成功"}');
								response.end();
								return false;
							}
						});
					}
				}
			});
		}else{
			response.write('{state:"false"}');
			response.end();
			return false;
		}
	}
	//删除任务
	this.f_deleteTask=function(request,response,param){
		
	}
}
module.exports = new mothedMap();

function parseJSON(req, res, next) {
	var arr = [];
	req.on("data", function(data) {
		arr.push(data);
	});
	req.on("end", function() {
		var data = Buffer.concat(arr).toString(),
			ret;
		try {
			var ret = JSON.parse(data);
		} catch(err) {}
		req.body = ret;
		next();
	})
}