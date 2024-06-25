const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    projectId: { type: String },
    status: { type: Number }
});

const userSchema = new Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    type: { type: String, required: true },
    password: { type: String, required: true },
    createdOn: { type: Date, default: Date.now },
    projects: [projectSchema]
});

const User = mongoose.model('User', userSchema);
module.exports = User;
