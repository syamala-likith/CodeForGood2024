const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    name : {type:String},
    level : {type:String},
    budget:{type:Number},
    description : {type:String},
    cycle:{type:String},
    dateofstarting : {type:Date,default:new Date().getTime()},
    status: {type:Number},
});



module.exports = mongoose.model("Project",projectSchema);