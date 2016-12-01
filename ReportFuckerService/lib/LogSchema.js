var mongoose=require("mongoose");
var Schema = mongoose.Schema;
var LogSchema=new Schema({
    name : String,
	userid:Schema.Types.ObjectId,
	time:Date,
	param:String
});
var LogSchema=mongoose.model('log',LogSchema,'log');
module.exports = LogSchema;