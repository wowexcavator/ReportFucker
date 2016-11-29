var mongoose=require("mongoose");
var DB_URL=require('./ServerConfig.js').DB_URL;
	mongoose.connect(DB_URL);
var Schema=mongoose.Schema;
var taskSchema=new Schema({
		_id :Schema.Types.ObjectId,
		userid:Schema.Types.ObjectId,
        createtime : Date,
        date : Date,
        content : String,
        state : String,
        delete:Boolean
	});
var taskModel=mongoose.model('task',taskSchema,'task');
module.exports=taskModel;