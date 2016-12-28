var userModel = require('./UserSchema.js');
var taskModel = require('./TaskSchema.js');
var tcTaskModel = require('./TcTaskSchema.js');
var mongoose = require("mongoose");

function mothedMap() {
	//登陸方法
	this.f_login = function(request, response, param, userlist) {
			if(param != null && param.name != null && param.name != '') {
				var user = userModel.findOne({
					name: param.name
				}, function(err, res) {
					if(err) {
						response.write('{"state":"false"}');
						response.end();
						return false;
					} else {
						var tuser = res;
						if(tuser!=null&&param.pass != null && param.pass == tuser.pass) { //登陆成功
							var session = {
								key: mongoose.Types.ObjectId().toString(),
								userid: tuser._id.toString(),
								lastDate:new Date( new Date().getTime() + (7 * 24 * 60 * 60 * 1000)+28800000)
							};
							request.session = session;
							userlist.push(request.session);
							response.write('{"state":"success","msg":"登陆成功","key":"' + session.key + '"}');
							response.end();
							return true;
						} else {
							response.write('{"state":"false","msg":"密码错误"}');
							response.end();
							return false;
						}
					}
				});
			} else {
				response.write('{"state":"false"}');
				response.end();
				return false;
			}

		}
		//注冊
	this.f_regist = function(request, response, param) {
			if(param != null) {
				if(param.name == null || param.name == '') {
					response.write('{"state":"false","msg":"用户名不能为空"}');
					response.end();
					return false;
				}
				if(param.pass == null || param.pass == '') {
					response.write('{"state":"false","msg":"密码不能为空"}');
					response.end();
					return false;
				}
				if(param.email == null || param.email == '') {
					response.write('{"state":"false","msg":"邮箱不能为空"}');
					response.end();
					return false;
				}
				//数据库操作
				userModel.find({
					'name': param.name
				}, function(err, res) {
					if(err) {
						response.write('{"state":"false"}');
						response.end();
						return false;
					} else {
						if(res.length > 0) {
							response.write('{"state":"false","msg":"用户名已经被注册了"}');
							response.end();
							return false;
						} else {
							var user = new userModel({
								_id: mongoose.Types.ObjectId(),
								name: param.name,
								pass: param.pass,
								registemail: param.email,
								createtime:new Date(new Date().getTime()+28800000),
								delete: false,
								permission: true,
								autosend: false,
								sendfrequency: 'week',
								sendday: 1,
								sendhour: 0,
								sendmine: 0,
							});
							//保存用户
							user.save(function(err, res, na) {
								if(err) {
									response.write('{"state":"false"}');
									response.end();
									return false;
								} else {
									if(na > 0) {
										response.write('{"state":"success","msg":"注册成功"}');
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
	this.f_editpass = function(request, response, param, userlist) {
			if(param) {
				if(param.oldpass == null || param.oldpass == '') {
					response.write('{"state":"false","msg":"原密码不能为空"}');
					response.end();
					return false;
				}
				if(param.newpass == null || param.newpass == '') {
					response.write('{"state":"false","msg":"新密码不能为空"}');
					response.end();
					return false;
				}
				userModel.findById(request.session.userid, function(err, res) {
					if(err) {
						response.write('{"state":"false"}');
						response.end();
						return false;
					} else {
						if(res) {
							if(res.pass == param.oldpass) {
								userModel.findByIdAndUpdate(request.session.userid, {
									pass: param.newpass
								}, function(err, res) {
									if(err) {
										response.write('{"state":"false"}');
										response.end();
										return false;
									} else {
										if(res) {
											response.write('{"state":"success","msg":" 密码修改成功！"}');
											for(var i = 0; i < userlist.length; i++) {
												var node = userlist[i];
												if(node.key == param.key) {
													userlist.splice(i, 1); //删除该项
												}
											}
											request.session = null;
											response.end();
											return true;
										}
									}
								});
							} else {
								response.write('{"state":"false","msg":"密码不匹配"}');
								response.end();
								return false;
							}

						} else {
							response.write('{"state":"false"}');
							response.end();
							return false;
						}
					}
				});

			} else {
				response.write('{"state":"false"}');
				response.end();
				return false;
			}
		}
		//退出方法
	this.f_logout = function(request, response, param, userlist) {
			if(param != null && param.key != null) {
				response.write('{"state":"success","msg":" 退出成功！"}');
				for(var i = 0; i < userlist.length; i++) {
					var node = userlist[i];
					if(node.key == param.key) {
						userlist.splice(i, 1); //删除该项
						return false;

					}
				}
				request.session = null;
				response.end();
				return false;
			} else {
				response.write('{"state":"false"}');
				response.end();
				return false;
			}

		}
		//根据日期获取数据
	this.f_getListByDate = function(request, response, param) {
			if(param) {
				if(param.date != null) {

					
					taskModel.find({
						'userid': request.session.userid,
						'date': {
							$gte: new Date(new Date(param.date).getTime()+28800000),
							$lt: new Date(new Date(param.date).getTime()+86400000+28800000)
						}
					}, function(err, res) {
						if(err) {
							response.write('{"state":"false"}');
							response.end();
							return false;
						} else {
							var json = [];
							for(var i = 0; i < res.length; i++) {
								var node = res[i];
								if(!node.delete) {
									json.push({
										id: node.id.toString(),
										content: node.content,
										state: node.state,
										'date':timeToLocalTime(node.date.getTime()-28800000),
										localid:node.localid
									});
								}
							};
							var jsonstr = JSON.stringify(json);
							response.write('{"state":"success","data":' + jsonstr + '}');
							response.end();
							return false;
						}
					})
				} else {
					response.write('{"state":"false","msg":"参数为空"}');
					response.end();
					return false;
				}
			} else {
				response.write('{"state":"false",msg:"参数为空"}');
				response.end();
				return false;
			}
		}
		//获取设置信息
	this.f_getSetInfo = function(request, response) {
			userModel.findById(request.session.userid, function(err, res) {
				if(err) {
					response.write('{"state":"false"}');
					response.end();
					return false;
				} else {
					var obj = {
						name: res.name,
						useremail: res.useremail,
						emailserver: res.emailserver,
						reciveaddress: res.reciveaddress,
						sendfrequency: res.sendfrequency,
						sendday: res.sendday,
						sendhour: res.sendhour,
						sendmine: res.sendmine,
						autosend:res.autosend,
					};
					var objstr = JSON.stringify(obj);
					response.write('{"state":"success","data":' + objstr + '}');
					response.end();
					return false;
				}
			});
		}
		//设置邮箱信息
	this.f_setEmailInfo = function(request, response, param) {
			if(param) {
				var updateObj = {};
				var state = true;
				if(param.useremail) {
					updateObj.useremail = param.useremail;
					state = false;
				}
				if(param.userpass) {
					updateObj.useremailpass = param.userpass;
					state = false;
				}
				if(param.emailserver) {
					updateObj.emailserver = param.emailserver;
					state = false;
				}
				if(param.reciveaddress) {
					updateObj.reciveaddress = param.reciveaddress;
					state = false;
				}
				if(state) {
					response.write('{"state":"false"}');
					response.end();
					return false;
				}
				userModel.findByIdAndUpdate(request.session.userid, updateObj, function(err, res) {
					if(err) {
						response.write('{"state":"false"}');
						response.end();
						return false;
					} else {
						response.write('{"state":"success","msg":"邮箱信息设置成功"}');
						response.end();
						return false;
					}
				})
			} else {
				response.write('{"state":"false"}');
				response.end();
				return false;
			}
		}
		//测试邮箱
	this.f_testEmail = function(request, response) {

		}
		//设置报表发送时间
	this.f_setReportTimer = function(request, response, param) {
			if(param) {
				var updateObj = {};
				if(param.sendfrequency) {
					updateObj.sendfrequency = param.sendfrequency;
				}
				if(param.sendday) {
					updateObj.sendday = param.sendday;
				}
				if(param.sendhour) {
					updateObj.sendhour = param.sendhour;
				}
				if(param.sendmine) {
					updateObj.sendmine = param.sendmine;
				}
				if(param.autosend) {
					updateObj.autosend = param.autosend;
				}
				userModel.findByIdAndUpdate(request.session.userid, updateObj, function(err, res) {
					if(err) {
						response.write('{"state":"false"}');
						response.end();
						return false;
					} else {
						response.write('{"state":"success","msg":"设置报表发送事件成功"}');
						response.end();
						return false;
					}
				})
			} else {
				response.write('{"state":"false"}');
				response.end();
				return false;
			}
		}
		//增加自动填充任务
	this.f_addAutoTask = function(request, response, param) {
			if(param) {
				if(param.content==null){
					response.write('{"state":"false"}');
					response.end();
					return false;
				}
				var task = new tcTaskModel({
					userid: request.session.userid,
					content: param.content,
					delete: false
				});
				task.save(function(err, res) {
					if(err) {
						response.write('{"state":"false"}');
						response.end();
						return false;
					} else {
						if(res!=null) {
									response.write('{"state":"success","msg":"添加自动填充任务成功"}');
									response.end();
									return false;
						}else{
							response.write('{"state":"false"}');
									response.end();
									return false;
						}
					}
				});

			} else {
				response.write('{"state":"false"}');
				response.end();
				return false;
			}
		}
		//获取自动填充任务
	this.f_getAutoTask = function(request, response, param) {
			if(param) {
					tcTaskModel.find({
						'userid': request.session.userid
					}, function(err, res) {
						if(err) {
							response.write('{"state":"false"}');
							response.end();
							return false;
						} else {
							var list = [];
							for(var i = 0; i < res.length; i++) {
								var node = res[i];
								if(!node.delete) {
									list.push({
										id: node._id,
										content: node.content
									});
								}
							}
							var objstr = JSON.stringify(list);
							response.write('{"state":"success","data":' + objstr + '}');
							response.end();
							return false;
						}
					})
				
			} else {
				response.write('{"state":"false"}');
				response.end();
				return false;
			}
		}
		//删除自动填充任务
	this.f_deleteTcTask = function(request, response, param) {
			if(param) {
				if(param.id) {
					tcTaskModel.findByIdAndUpdate(param.id, {
						'delete': true
					}, function(err, res) {
						if(err) {
							response.write('{"state":"false"}');
							response.end();
							return false;
						} else {
							response.write('{"state":"success","msg":"删除填充任务成功"}');
							response.end();
							return false;
						}
					});
				}
			} else {
				response.write('{"state":"false"}');
				response.end();
				return false;
			}
		}
		//增加任务
	this.f_addTask = function(request, response, param) {
			if(param) {
				if(param.date==null||param.content==null){
					response.write('{"state":"false"}');
					response.end();
					return false;
				}
				var task = new taskModel({
					userid: request.session.userid,
					createtime: new Date(new Date().getTime()+28800000),
					date: new Date(new Date(param.date).getTime()+28800000),
					content: param.content,
					state: 'undone',
					delete: false,
					localid:param.localid
				});
				task.save(function(err,res) {
					if(err) {
						response.write('{"state":"false"}');
						response.end();
						return false;
					} else {
						response.write('{"state":"success","msg":"添加任务成功","taskid":"'+res.id.toString()+'","localid":"'+res.localid+'"}');
						response.end();
						return true;
					}
				});

			} else {
				response.write('{"state":"false"}');
				response.end();
				return false;
			}
		}
		//删除任务
	this.f_deleteTask = function(request, response, param) {
			if(param) {
				if(param.id) {
					taskModel.findByIdAndUpdate(param.id, {
						'delete': true
					}, function(err, res) {
						response.write('{"state":"success","msg":"任务删除成功"}');
						response.end();
						return true;
					});
				} else {
					response.write('{"state":"false"}');
					response.end();
					return false;
				}
			} else {
				response.write('{"state":"false"}');
				response.end();
				return false;
			}
		}
		//更新任务
	this.f_updateTask = function(request, response, param) {
		if(param) {
			if(param.id) {
				var obj = {};
				if(param.content) {
					obj.content = param.content;
				}
				if(param.state) {
					obj.state = param.state;
				}
				taskModel.findByIdAndUpdate(param.id, obj, function(err, res) {
					if(err) {
						response.write('{"state":"false"}');
						response.end();
						return false;
					} else {
						response.write('{"state":"success","msg":"任务更新成功"}');
						response.end();
						return false;
					}
				});
			} else {
				response.write('{"state":"false"}');
				response.end();
				return false;
			}
		} else {
			response.write('{"state":"false"}');
			response.end();
			return false;
		}
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


//笔记记录
//mongodb存储时间会应为市区问题少8个小时，所以再存储的时候要增加8个小时
function timeToLocalTime(date){
	var time=new Date(date);
	var str='';
	str+=time.getFullYear()+'.';
	str+=time.getMonth()+1+'.';
	str+=time.getDate();
	return str;
}
