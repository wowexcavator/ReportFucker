//获取某一天的任务列表
{
	
}
//登录api
//login
 
 //request
 {
 	name:'123',
 	pass:'123',
 	time:'2016.2.3'
 }
 //response
 {
 	state:"succcess",//false
 }



//注册API
//regist

 //request
 {
 	name:'123',
 	pass:'123',
 	email:'14564654@QQ.COM',
 	time:'2016.2.3'
 }
 //response
 {
 	state:"succcess",//false
 	msg:'注册成功';//名称已经被占用？
 }

//修改密码
//editpass

 //request
 {
 	name:'123',
 	oldpass:'123',
 	newpass:'1234'
 }
 //response
 {
 	state:"succcess",//false
 	msg:'密码修改成功'//两次密码不能一样吧
 }

//退出登录
//logout

 //request

 //response
 {
 	state:"succcess",//false
 	msg:'您已经退出'//两次密码不能一样吧
 }
 
//获取某个日期的任务列表
//getListByDate

 //request
{
	date:'2016.12.12'
}
 //response
 {
 	state:"succcess",//false
 	data:[{
 		date:'2016.12.12',
 		taskname:'任务1号',
 		content:'今日发呆',
 		state:'undone',//complete
 	}]
 }
 
//获取设置信息
//getSetInfo

 //request
{
	
}
 //response
 {
 	state:"succcess",//false
 	data:{
 		name:'test1',
 		useremail:'1456@qq.com',
 		useremailpasslength:12,
 		emailserver:"192.168.2.3",
 		reciveaddress:'test23@qq.com',
 		useremail:'1456@qq.com',
 		autosend:'true',//false  自动发送是否开启
 		sendfrequency:'day',//week  //month  //year  发送频率
 		sendday:1,//1-7
 		sendhour:0,//0-23
 		sendmine:0,//0-59
 		tclist:[{
 			id:123,
 			content:'今天什么都不做',
 		}]
 		
 	}
 	msg:'';
 }
 
//设置邮箱信息
//setEmailInfo

//request
{
	userpass:'123456789',
 	emailserver:"192.168.2.3",
 	reciveaddress:'test23@qq.com',
 	useremail:'1456@qq.com',
}
//response
{
	state:'success',//false
	msg:'';
}

//测试邮箱状态
//testEmail
{
	
}
//response
{
	state:'success',//false
	msg:'',
}


//设置报周期及频率
setReportTimer
//request
{
		autosend:'true',//false  自动发送是否开启
 		sendfrequency:'day',//week  //month  //year  发送频率
 		sendday:1,//1-7
 		sendhour:0,//0-23
 		sendmine:0,//0-59
}
//response
{
	state:'success',
}

//增加自动回复
//addAutoTask

//requeset
{
	content:'45454'
}
//response
{
	state:'success',//false
}
