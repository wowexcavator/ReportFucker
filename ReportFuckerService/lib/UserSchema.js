var mongoose=require("mongoose");
var Schema = mongoose.Schema;
var userSchema=new Schema({
    _id :  Schema.Types.ObjectId,
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