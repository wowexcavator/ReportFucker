var mongoose=require("mongoose");
var Schema=mongoose.Schema;
var taskSchema=new Schema({
		userid:Schema.Types.ObjectId,
        createtime : Date,
        date : Date,
        content : String,
        state : String,
        delete:Boolean,
        localid:String,
	});
var taskModel=mongoose.model('task',taskSchema,'task');
module.exports=taskModel;