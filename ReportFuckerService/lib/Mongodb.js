var mongoose=require("mongoose"),
	DB_URL='mongodb://localhost:27017/reportfucker';
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
module.exports = new userModle();