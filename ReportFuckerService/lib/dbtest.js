var mongoose=require("mongoose"),
		DB_URL='mongodb://localhost:27017/reportfucker';

mongoose.connection.on('connected',function(){
		console.log('success');
});
mongoose.connection.on('error',function(){
		console.log('error');
});

mongoose.connect(DB_URL);
var Schema = mongoose.Schema;
var userSchema=new Schema({
    _id :  Schema.Types.ObjectId,
    name : String,
    pass : String,
    createtime: Date,
    useremail : String,
    useremailpass : String,
    reciveaddress : String,
    emailserver : String,
    autosend : Boolean,
    sendfrequency : String,
    sendday : Number,
    sendhour : Number,
    sendmine : Number,
    tclist : [ 
        {
            id :Schema.Types.ObjectId,
            content : String
        }
    ],
    task : [ 
        {
        		id :Schema.Types.ObjectId,
            createtime : Date,
            date : Date,
            content : String,
            state : String
        }
    ]
});

var userModle=mongoose.model('user',userSchema,'user');
var user=new  userModle();
user.name="test";
user.pass='1465';
user.tclist.push({
	id:mongoose.Types.ObjectId(),
	content:'456465'
});
user.task.push({
	id:mongoose.Types.ObjectId(),
	content:'sdfdsfsdfsd'
});
user.save(function(){
	console.log('insert success');
});
setTimeout(function(){process.exit();},4000);

//跟新
userModle.update({'name':"test"},{'name':"123"},function(err,res){
	if(err){
		console.log('update faile');
	}else{
		console.log(res);
	}
});

//查询
var wherestr={"name":'123'};
userModle.find(wherestr,function(err,res){
	if(err){
		console.log('select faile');
	}else{
		console.log(res);
	}
});
//删除
userModle.remove({_id:'5832b5cdf6df2801984f83f0'},function(err,res){
	if(err){
		console.log(err);
	}else{
		console.log('delete success');
		console.log(res);
	}
});