var mongoose=require("mongoose"),
	var DB_URL=require('./ServerConfig.js').DB_URL;
	mongoose.connect(DB_URL);
var Schema = mongoose.Schema;
var userSchema=new Schema({
    _id :  Schema.T ypes.ObjectId,
    name : String,
    pass : String,
    registemail:String,
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
    delete:Boolean,//是否删除
   	permission:Boolean,//账户是否允许登录
});
var userModle=mongoose.model('user',userSchema,'user');
module.exports = userModle;