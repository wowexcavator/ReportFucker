var mongoose=require("mongoose");
var DB_URL=require('./ServerConfig.js').DB_URL;
	mongoose.connect(DB_URL);
var Schema=mongoose.Schema;
var tcTaskSchema=new Schema({
            _id :Schema.Types.ObjectId,
            userid:Schema.Types.ObjectId,
            content : String,
            delete:Boolean
	});
var tctaskModel=mongoose.model('tctask',tcTaskSchema,'tctask');
module.exports=tctaskModel;