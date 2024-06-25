const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    projectId: { type: String},
    status: { type: Number}
});


const userSchema = new Schema({
    fullName : {type:String},
    email : {type:String},
    type:{type:String},
    password : {type:String},
    createdOn : {type:Date,default:new Date().getTime()},
    projects: { type: [projectSchema] }
});



module.exports = mongoose.model("User",userSchema);