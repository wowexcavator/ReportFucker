var userModel = ruquire('./Mongodb.js');

function mothedMap() {
	//登陸方法
	this.f_login = function(request, response, param) {

			if(param != null && param.name != null && param.name != '') {
				var user = userModel.find({
					name: param.name
				}, function(err, res) {
					if(err) {
						response.write('{state:"false"}');
						console.log('login_db_err');
						return false;
					} else {
						if(param.pass != null && param.pass == user.pass) { //登陆成功
							request.session.id = user['_id'];
							response.write('{state:"succcess","登陆成功"}');
							return true;
						} else {
							response.write('{state:"false"}');
							return false;
						}
					}
				});
			}
		}
		//注冊
	this.f_regist = function(request, response, param) {
			if(param != null) {
				if(param.name == null || param.name == '') {
					response.write('{state:"false",msg:"用户名不能为空"}');
					return false;
				}
				if(param.pass == null || param.pass == '') {
					response.write('{state:"false",msg:"密码不能为空"}');
					return false;
				}
				if(param.email == null || param.email == '') {
					response.write('{state:"false",msg:"邮箱不能为空"}');
					return false;
				}
				userModel.find({name: param.name},function(err,res){
					if(err){
						response.write('{state:"false"}');
						return false;
					}else{
						if(res){
							
						}else{
							
						}
					}
				});
			}
		}
		//登陸方法
	this.f_editpass = function(request, response) {

		}
		//退出方法
	this.f_logout = function(request, response) {

		}
		//根据日期获取数据
	this.f_getListByDate = function(request, response) {

		}
		//获取设置信息
	this.f_getSetInfo = function(request, response) {

		}
		//设置邮箱信息
	this.f_setEmailInfo = function(request, response) {

		}
		//测试邮箱
	this.f_testEmail = function(request, response) {

		}
		//设置报表发送时间
	this.f_setReportTimer = function(request, response) {

		}
		//增加自动填充任务
	this.f_addAutoTask = function(request, response) {

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