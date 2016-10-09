//对应的地址表
window.addressTable = {

	}
	//本地操作任务队列
window.LocalTaskList = [];
//本地存储操作对象
window.DB = new localDB();
//顶级状态管理器
window.TopState  = {
	serverState: '',
};
//消息管理器
window.msg = new Message();
//任务管理器
window.TM = new TaskManage();
//列表管理
window.TL = new TaskList();
//服务器状态通信
window.NS=new NetServer();
$(function() { //设置窗的弹出动画
	$("#btn-set").click(function() {
		$("#setting").show();
		$("#bg").fadeIn("slow");
		$("#setting").animate({
			'right': '1px'
		}, "1500");

	});
	$("#btn-return").click(function() {
		$("#bg").fadeOut("slow");
		$("#setting").animate({
			'right': '-90%'
		}, "1500");
	});
})

//时间选择控件
$(function() {
	window.sum = 4; //每次增加的日期块数量
	$("#datelist").scroll(function() {
		//如果滚动到顶部
		if($("#datelist").scrollTop() <= 3) {
			getTopNode();
			$("#datelist").scrollTop(4);
		}
		//如果滚动到底部
		if($("#datelist").scrollTop() + $("#datelist").height() == $("#datelist ul").height()) {
			getBottomNode();
		}
	});

	function getTopNode() { //根据现在的日期拼接未来的时间块
		var html = "";
		var times = getTopTime();
		var tlist = [];
		for(var i = 0; i < sum; i++) {
			var thtml = "";
			times = getopPreTimeStr(times);
			thtml += "<li class='btn-pulse' onclick='dateClick(this)' date-time='" + times[0] + "." + times[1] + "." + times[2] + "'>";
			thtml += times[0] + "年" + times[1] + "月" + times[2] + "日";
			thtml += "</li>";
			tlist.push(thtml);
		}
		if(tlist.length > 0) {
			for(var i = tlist.length; i > 0; i--) {
				html += tlist[i - 1];
			}
		}
		//链接时间块
		$("#datelist ul").prepend(html);
		//释放底部的的日期块
		if($("#datelist ul>li").length > 1000) {
			for(var i = 0; i < 4; i++) {
				$("#datelist ul>li").last().remove();
			}
		}
	}

	function getBottomNode() { //根据现在的日期拼接过去的时间块
		var html = "";
		var times = getBottomTime();
		for(var i = 0; i < sum; i++) {
			times = getopNextTimeStr(times);
			html += "<li class='btn-pulse' onclick='dateClick(this)' date-time='" + times[0] + "." + times[1] + "." + times[2] + "'>";
			html += times[0] + "年" + times[1] + "月" + times[2] + "日";
			html += "</li>";
		}
		//链接时间块
		$("#datelist ul").append(html);
		//释放底部的的日期块
		if($("#datelist ul>li").length > 1000) {
			for(var i = 0; i < 4; i++) {
				$("#datelist ul>li").first().remove();
			}
		}

	}

	function getTopTime() { //获取顶部块的时间
		var timestr = $("#datelist ul>li").first().attr("date-time");
		return timestr.split(".");
	}

	function getBottomTime() {
		var timestr = $("#datelist ul>li").last().attr("date-time");
		return timestr.split(".");
	}
	Date.prototype.Format = function(fmt) { //日期时间格式化
		var o = {
			"M+": this.getMonth() + 1, //月份   
			"d+": this.getDate(), //日   
			"h+": this.getHours(), //小时   
			"m+": this.getMinutes(), //分   
			"s+": this.getSeconds(), //秒   
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度   
			"S": this.getMilliseconds() //毫秒   
		};
		if(/(y+)/.test(fmt))
			fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for(var k in o)
			if(new RegExp("(" + k + ")").test(fmt))
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	}

	function getopNextTimeStr(preTimes) { //获取下一个块的时间字符串
		var str = preTimes[0] + "." + preTimes[1] + "." + preTimes[2];
		var time = Math.round(new Date(str).getTime() / 1000)
		time -= 86400; //减去一天的毫秒值
		time = new Date(time * 1000);
		return time.toLocaleDateString().split('/');
	}

	function getopPreTimeStr(NextTimes) { //获取上一个块的时间字符串
		var str = NextTimes[0] + "." + NextTimes[1] + "." + NextTimes[2];
		var time = Math.round(new Date(str).getTime() / 1000)
		time += 86400; //减去一天的毫秒值
		time = new Date(time * 1000);
		return time.toLocaleDateString().split('/');
	}

	//日期控件初始化
	var time = new Date();
	var times = time.toLocaleDateString().split("/");
	var html = "";
	html += "<li class='active' onclick='dateClick(this)' date-time='" + times[0] + "." + times[1] + "." + times[2] + "'>";
	html += times[0] + "年" + times[1] + "月" + times[2] + "日";
	html += "</li>";
	$("#datelist ul").html(html);
	getBottomNode();
	getTopNode();
	$("#datelist").scrollTop(4);

})

function dateClick(mythis) { //日期选择块的日期选择事件
	$("#datelist li").removeClass('active');
	$(mythis).addClass('active');
	window.TM.setDate($(mythis).attr('date-time'));
	$("#tasklist ul").html(window.TL.getTaskListStrutsByDate());
}
$(function() {
	$("#btn-close").click(function() { //退出程序
		nw.App.quit();
	});
	$("#btn-small").click(function() {
		var win = nw.Window.get();
		win.minimize();
	});
	$("#btn-refresh").click(function() {
		location.reload();
	});
})
$(function() { //任务列表向下滚动
		$("#tasklist").scroll(function() {
			//如果滚动到底部
			if($("#tasklist").scrollTop() + $("#tasklist").height() == $("#tasklist ul").height()) {
				if($("#tasklist>ul>li").length < 100) {
					var html = "";
					for(var i = 0; i < 4; i++) {
						html += "<li onblur='taskliBlur(this,event)' ondblclick='addOrEditTask(this, event)' data-hasetask='false' class='taskblock tasknullbg' onclick='taskClick(this)'><div  class='taskcontent' ></div><div data-show='false' class='btns'>\
						<ul>\
								<li class='complete '  onclick='taskSuccess(this,event)' data-taskstate='false'>完成</li>\
								<li class='delete' onclick='taskDelete(this,event)'>删除</li>\
							</ul>\
						</div></li>";
					}
					$("#tasklist>ul").append(html);
				}

			}
		});
		//任务列表初始化
		$("#tasklist ul").html(window.TL.getTaskListStrutsByDate());
	})
	//任务列表按钮弹出事件
function taskClick(mythis) {
	if($(mythis).attr('data-hasetask') == 'true') {
		if($(mythis).find(".btns").attr("data-show") == 'true') {
			$(mythis).find(".btns").animate({
				'right': '-51px'
			}, 100);
			$(mythis).find(".btns").attr("data-show", 'false');
		} else {
			//缩回所有已有的任务按钮盘
			$(".btns").animate({
				'right': '-51px'
			}, 50);
			$(".btns").attr("data-show", 'false');

			$(mythis).find(".btns").animate({
				'right': '0'
			}, 100);
			$(mythis).find(".btns").attr("data-show", 'true');
		}
	}
}
//任务完成	
function taskSuccess(mythis, e) {
	if($(mythis).attr("data-taskstate") == "true") { //如果任务完成
		$(mythis).text("完成");
		$(mythis).attr("data-taskstate", 'false');
		$(mythis).parents(".taskblock").eq(0).removeClass("taskcp");
		//			e.stopPropagation()
		window.TM.updateTask({
			localid: $(mythis).parents(".taskblock").eq(0).attr('data-localid'),
			state: 'undone',
		});
	} else {
		$(mythis).text("撤销");
		$(mythis).attr("data-taskstate", 'true');
		$(mythis).parents(".taskblock").eq(0).addClass("taskcp");
		//			e.stopPropagation()
		window.TM.updateTask({
			localid: $(mythis).parents(".taskblock").eq(0).attr('data-localid'),
			state: 'complete',
		});
	}
}
//删除任务
function taskDelete(mythis, e) {
	var node = $(mythis).parents('.taskblock').eq(0);
	node.find(".taskcontent").text('');
	node.attr('data-hasetask', 'false');
	node.removeClass("taskcp");
	node.addClass("tasknullbg");
	node.find('.complete').text("完成");
	node.find('.complete').attr("data-taskstate", 'false');
	//缩回所有已有的任务按钮盘
	node.find(".btns").animate({
		'right': '-51px'
	}, 100);
	node.find(".btns").attr("data-show", 'false');
	var lid = node.attr('data-localid');
	window.TM.deleteTask(lid);
}
//添加和编辑任务
function addOrEditTask(mythis, e) {
	$(mythis).find(".taskcontent").css('text-indent', '0px');
	$(mythis).removeClass("tasknullbg");
	$(mythis).addClass("addtask");
	var node = "<textarea class='ta' onblur='taskBlur(this,event)'></textarea>"
	var str = $(mythis).find(".taskcontent").text();
	$(mythis).find(".taskcontent").html(node);
	$(mythis).find(".ta").text(str);
	$(mythis).find(".ta").focus();

}
//任务编辑框失去焦点之后
function taskBlur(mythis, e) {
	$(mythis).parents(".taskcontent").eq(0).css('text-indent', '20px');
	var str = $(mythis).val();
	$(mythis).parents('.taskblock').eq(0).attr('data-hasetask', 'true');
	var lid = $(mythis).parents('.taskblock').eq(0).attr('data-localid');
	if(lid != null && lid != '') {
		window.TM.updateTask({
			content: str,
			localid: lid
		});
	} else {
		lid = getLocalId();
		$(mythis).parents('.taskblock').eq(0).attr('data-localid', '' + lid);
		window.TM.createTask({
			name: '',
			content: str,
			state: 'undone', //任务状态未完成
			localid: lid,
		});
	}

	$(mythis).parents(".taskcontent").eq(0).text(str);

}
//任务框失去焦点之后
function taskliBlur(mythis, e) {
	taskClick(mythis);
}

//禁止向窗口拖放东西
$(window).on('dragover', function(e) {
	e.preventDefault();
	e.originalEvent.dataTransfer.dropEffect = 'none';
});
$(window).on('drop', function(e) {
	e.preventDefault();
});
//屏蔽右键按钮
document.oncontextmenu = function() {
	return false;
}

//本地数据库读取
function localDB() {

	//数据源
	this.Data = null;

	//将数据持久化
	this.saveStorage = function(obj) {
			try {
				localStorage.Data = JSON.stringify(obj);
			} catch(error) {
				return false;
			}
			return true;
		}
		//获取持久化的数据
	this.getStorage = function() {
			try {
				return JSON.parse(localStorage.Data);
			} catch(error) {
				return null;
			}
		}
		//读取某一天的数据
	this.getDataByDate = function(date) {
			if(this.Data[date] != null) {
				return this.Data[date];
			} else {
				return null;
			}
		}
		//跟新某一天的数据
	this.updateTask = function(date, data) {
			for(var i = 0; i < this.Data[date].length; i++) {
				if(this.Data[date][i].localid == data.localid) {
					var powertable = {
						'date': true,
						name: true,
						id: false,
						isTb: true,
						content: true,
						state: true,
						localid: false, //内部id,标识每天的几号任务
					};
					for(var n in data) {
						if(powertable[n]) {
							this.Data[date][i][n] = data[n];
						}
					}
				}
			}
			this.saveStorage(this.Data);
		}
		//增加某一天的数据
	this.setDateByDate = function(date, data) {
			//如果本地数据存在,则更新,若不存在,则增加
			if(this.Data[date] != null) {
				this.Data[date + ''].push({
					'date': date,
					name: data.name,
					id: data.id,
					isTb: data.isTb,
					content: data.content,
					state: data.state,
					localid: data.localid, //内部id,标识每天的几号任务
				});
			} else {
				this.Data[date + ''] = [];
				this.Data[date + ''].push({
					'date': date,
					name: data.name,
					id: data.id,
					isTb: data.isTb,
					content: data.content,
					state: data.state,
					localid: data.localid, //内部id,标识每天的几号任务
				});
			}
			//标记为未上传,调用上传模块进行扫描更新
			this.saveStorage(this.Data);
		}
		//删除某项任务
	this.deleteTask = function(date, localid) {
			var tasklist = this.Data[date];
			if(tasklist) {
				for(var i = 0; i < tasklist.length; i++) {
					if(tasklist[i].localid == localid) {
						tasklist.splice(i, 1); //删除数组中的
					}
				}
			}
			this.saveStorage(this.Data);
		}
		//构造函数

	if(localStorage.Data != null) {
		this.Data = this.getStorage();
	} else {
		this.saveStorage({});
		this.Data = this.getStorage();
	}

}
//任务管理器
function TaskManage() {
	//当前操作日期
	var time = new Date();
	var times = time.toLocaleDateString().split("/");
	this.curdate = times[0] + '.' + times[1] + '.' + times[2];
	//新建任务
	this.createTask = function(obj) {
			if(obj) {
				obj.date = this.curdate;
				obj.id = null;
				obj.isTb = false;
			}
			window.DB.setDateByDate(this.curdate, obj)
		}
		//删除任务
	this.deleteTask = function(localid) {
			window.DB.deleteTask(this.curdate, localid);
		}
		//更新任务
	this.updateTask = function(obj) {
			window.DB.updateTask(this.curdate, obj);
		}
		//更改指示日期
	this.setDate = function(date) {
			if(date) {
				this.curdate = date;
			}
		}
		//获取localid
	this.getLocalId = function() {
			return new Date().getTime();
		}
		//获取某一天的任务列表
	this.getTaskListByDate = function() {
		return window.DB.getDataByDate(this.curdate);
	}
}

//获取当前时间戳
function getLocalId() {
	return new Date().getTime();
}
//任务列表对象
function TaskList() {
	//获取某一天的任务列表结构
	this.getTaskListStrutsByDate = function() {
		var tasklist = window.TM.getTaskListByDate(); //获取当前日期tasklist
		if(tasklist && tasklist.length > 0) {
			var html = "";
			for(var i = 0; i < tasklist.length; i++) {
				var taskcp = tasklist[i].state == 'complete' ? 'taskcp' : '';
				html += "<li onblur='taskliBlur(this,event)' ondblclick='addOrEditTask(this, event)' data-hasetask='true' class='taskblock  " + taskcp + "' data-localid='" + tasklist[i].localid + "' onclick='taskClick(this)'><div class='taskcontent' >" + tasklist[i].content + "</div><div data-show='false' class='btns'>\
							<ul>\
								<li class='complete '  onclick='taskSuccess(this,event)' data-taskstate='false'>完成</li>\
								<li class='delete ' onclick='taskDelete(this,event)'>删除</li>\
							</ul>\
						</div></li>";
			}
			var max = 0;
			if(tasklist.length <= 12) {
				max = 12 - tasklist.length;
			} else {
				max = Math.ceil(tasklist.length / 4) * 4;
			}
			for(var n = 0; n < max; n++) {
				html += "<li onblur='taskliBlur(this,event)' ondblclick='addOrEditTask(this, event)' data-hasetask='false' class='taskblock tasknullbg' onclick='taskClick(this)'><div class='taskcontent' ></div><div data-show='false' class='btns'>\
							<ul>\
								<li class='complete '  onclick='taskSuccess(this,event)' data-taskstate='false'>完成</li>\
								<li class='delete ' onclick='taskDelete(this,event)'>删除</li>\
							</ul>\
						</div></li>";
			}
			return html;
		} else {
			var html = "";
			for(var i = 0; i < 12; i++) {
				html += "<li onblur='taskliBlur(this,event)' ondblclick='addOrEditTask(this, event)' data-hasetask='false' class='taskblock tasknullbg' onclick='taskClick(this)'><div class='taskcontent' ></div><div data-show='false' class='btns'>\
							<ul>\
								<li class='complete '  onclick='taskSuccess(this,event)' data-taskstate='false'>完成</li>\
								<li class='delete ' onclick='taskDelete(this,event)'>删除</li>\
							</ul>\
						</div></li>";
			}
			return html;
		}
	}
}
//检测服务器连接状态
$(function() {
		window.serverStateTimer = setInterval(function() {
			var callback = function() {
				$('#serverstate').text('已连接到服务器');
				$('#serverstate').css('color', '#4D89C1');
				window.serverState = true;
			}
			var ecallback = function() {
				$('#serverstate').text('与服务器失去联系');
				$('#serverstate').css('color', '#ff0000');
				window.serverState = false;
			}
			ajaxPackage("serverState", "Post", {}, "json", false, callback, ecallback);
		}, 60000);
	})
	//服务器管理类
function NetServer() {
	//服务器地址列表
	this.servertable = {
		base: 'www.shellcandy.cn',
		login: 'login',
		regist: 'regist',
		editpass: 'editpass',
		logout: 'logout',
		getListByDate: 'getListByDate',
		getSetInfo: 'getSetInfo',
		setEmailInfo: 'setEmailInfo',
		testEmail: 'testEmail',
		setReportTimer:'setReportTimer',
		addAutoTask:'addAutoTask',
	};
	//登录
	this.login = function(param, success, warn) {
			var address = this.servertable.base + '/' + this.servertable.login;
			var data = {
				name: param.name,
				pass: param.pass,
			}
			ajaxPackage(address, "Post", data, "json", false, success, warn);
		}
		//注册
	this.regist = function(param, success, warn) {
			var address = this.servertable.base + '/' + this.servertable.regist;
			var data = {
				name: param.name,
				pass: param.pass,
				email: param.email,
			}
			ajaxPackage(address, "Post", data, "json", false, success, warn);
		}
		//修改密码
	this.editpass = function(param) {
			var address = this.servertable.base + '/' + this.servertable.editpass;
			var data = {
				name: param.name,
				oldpass: param.oldpass,
				pass: param.pass,
			}
			var success = function(obj) {
				if(obj.state == 'success') {
					if(obj.msg) {
						window.msg.show(obj.msg);
					}
				}
			}
			var warn = function(obj) {
				window.msg.show('修改密碼失敗啦,看看是不是網斷掉了!');
			}
			ajaxPackage(address, "Post", data, "json", false, success, warn);
		}
		//退出登录
	this.logout = function() {
			var address = this.servertable.base + '/' + this.servertable.logout;
			var data = {};
			var success = function(obj) {
				if(obj.state == 'success') {
					if(obj.msg) {
						window.msg.show(obj.msg);
					}
				}
			}
			var warn = function(obj) {
				window.msg.show('退出失败,天了噜!');
			}
			ajaxPackage(address, "Post", data, "json", false, success, warn);
		}
		//获取某个日期的任务列表
	this.getListByDate = function(param) {
			var address = this.servertable.base + '/' + this.servertable.getListByDate;
			var data = {
				date: param.date,
			};
			var success = function(obj) {
				if(obj.state == 'success') {
					if(obj.data) {
						return obj.data;
					}
				}
			}
			var warn = function(obj) {

			}
			ajaxPackage(address, "Post", data, "json", false, success, warn);
		}
		//获取设置信息
	this.getSetInfo = function() {
			var address = this.servertable.base + '/' + this.servertable.getSetInfo;
			var data = {

			};
			var success = function(obj) {
				if(obj.state == 'success') {
					if(obj.data) {
						if(obj.data.name){
							$("#st-username").text(obj.data.name);
						}
						if(obj.data.useremail){
							$("#st-username").text(obj.data.useremail);
						}
						if(obj.data.useremailpasslength){
							var str='';
							for(var i=0;i<obj.data.useremailpasslength;i++){
								str+='*';
							}
							$("#st-myemailpass").text(obj.data.name);
						}
						if(obj.data.emailserver){
							$("#st-myemailaddress").text(obj.data.emailserver);
						}
						if(obj.data.reciveaddress){
							$("#st-reciveaddress").text(obj.data.reciveaddress);
						}
						if(obj.data.autosend!=null){
							
						}
						if(obj.data.name){
							$("#st-username").text(obj.data.name);
						}
					}
				}
			}
			var warn = function(obj) {

			}
			ajaxPackage(address, "Post", data, "json", false, success, warn);
		}
		//设置邮箱信息
	this.setEmailInfo = function(param) {
			var address = this.servertable.base + '/' + this.servertable.setEmailInfo;
			var data = {
				userpass: param.userpass,
				emailserver: param.emailserver,
				reciveaddress: param.reciveaddress,
				useremail: param.useremail,
			};
			var success = function(obj) {
				if(obj.state == 'success') {
					window.msg.show('邮箱设置成功!');
				} else {
					window.msg.show('邮箱设置失败!天啦噜!');
				}
			}
			var warn = function(obj) {

			}
			ajaxPackage(address, "Post", data, "json", false, success, warn);
		}
		//测试邮箱状态
	this.testEmail = function() {
			var address = this.servertable.base + '/' + this.servertable.testEmail;
			var data = {

			};
			var success = function(obj) {
				if(obj.state == 'success') {
					if(obj.msg) {
						window.msg.show(obj.msg);
					}
				}
			}
			var warn = function(obj) {

			}
			ajaxPackage(address, "Post", data, "json", false, success, warn);
		}
		//设置报周期及频率
	this.setReportTimer = function(param) {
		var address = this.servertable.base + '/' + this.servertable.setReportTimer;
		var data = {
			autosend: param.autosend,
			sendfrequency: param.sendfrequency,
			sendday: param.sendday,
			sendhour: param.sendhour,
			sendmine:param.sendmine,
		};
		var success = function(obj) {
			if(obj.state == 'success'){
				if(obj.msg) {
					window.msg.show('设置成功!天啦噜!');
				}
			}
		}
		var warn = function(obj) {

		}
		ajaxPackage(address, "Post", data, "json", false, success, warn);
	}
			//增加自动回复
	this.addAutoTask = function(param) {
		var address = this.servertable.base + '/' + this.servertable.addAutoTask;
		var data = {
		content:param.content,
		};
		var success = function(obj) {
			if(obj.state == 'success'){
				if(obj.msg) {
					window.msg.show('添加成功');
				}
			}
		}
		var warn = function(obj) {

		}
		ajaxPackage(address, "Post", data, "json", false, success, warn);
	}
}

//弹窗消息类
function Message(){
	//提示消息
	this.show = function(str) {
		alert(str);
	}
}

//设置部分
$(function(){
	$('input[name=sendtime]').change(function(){
		if($(this).attr('data-time')=='day'){
			$('.atuo-day').show();
			$('.atuo-week').hide();
		}
		if($(this).attr('data-time')=='week'){
			$('.atuo-day').hide();
			$('.atuo-week').show();
		}
	});
	
	//填充设置页面信息
	window.NS.getSetInfo();
})
