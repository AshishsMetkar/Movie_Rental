// movie_rental_jwtprivatekey

const mongoose = require("mongoose");
const Joi =require("joi")
const jwt = require("jsonwebtoken");
const config = require("config")
const usersSchema =  new mongoose.Schema({

        name:{
            type:String,
            minLength:[5,"Please enter minimum 5 characters"],
            maxLength:[50,"Please enter maximum 50 characters"],
            required:true
        },
        email:{
            type:String,    
            minLength:[5,"Please enter minimum 5 characters"],
            maxLength:[255,"Please enter maximum 255 characters"],
            required:true
        },
        password:{
            type:String,
            minLength:[5,"Please enter minimum 5 password characters"],
            maxLength:[1024,"Please enter maximum 1024 password characters"],
            required:true
        },
        isAdmin:{
            type:Boolean,
            default:false
        }
        
});

usersSchema.methods.getAuthToken =function(){
    return jwt.sign({_id:this._id, isAdmin:this.isAdmin},config.get("password"))
}

function validateUser(input){
    const schema = Joi.object({
        name:Joi.string().min(5).max(50).required(),
        email:Joi.string().min(5).max(255).required(),
        password:Joi.string().min(5).max(1024).required(),
        isAdmin:Joi.boolean().default(false)
    })
    return schema.validate(input)
}

module.exports.User=mongoose.model("User",usersSchema);
module.exports.validateUser =validateUser;

