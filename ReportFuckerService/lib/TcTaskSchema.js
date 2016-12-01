var mongoose=require("mongoose");
var Schema=mongoose.Schema;
var tcTaskSchema=new Schema({
            userid:Schema.Types.ObjectId,
            content : String,
            delete:Boolean
	});
var tctaskModel=mongoose.model('tctask',tcTaskSchema,'tctask');
module.exports=tctaskModel;