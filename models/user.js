const { types } = require('joi');
const mongoose = require('mongoose');
const Schema  = mongoose.Schema;
const passportlocalmongoose=require("passport-local-mongoose");


const userSchema=new Schema({
    email:{
        type: String,
        required: true,
    },
    //here by default passport-local-mongoose will add a username and password field to the schema
})

userSchema.plugin(passportlocalmongoose);

module.exports = mongoose.model('User', userSchema);