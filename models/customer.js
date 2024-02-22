const mongoose = require("mongoose");
const Joi =require("joi")
const customerSchema =  new mongoose.Schema({

        name:{
            type:String,
            minLength: [5,"Please enter minimum 5 characters"],
            maxLength:[50 ,"Please enter maximum 50 characters"],
            required:true
        },
        phone:{
            type:String,
            minLength:[7,"Please enter minimum 7 characters"],
            maxLength:[10,"Please enter maximum 10 characters"],
            required:true
        },
        isGold:{
            type:Boolean,
            default:false
        }
})

const Customer= mongoose.model("Customer",customerSchema);


function validateCustomer(input){
    const schema = Joi.object({
        name:Joi.string().min(5).max(50).required(),
        phone:Joi.string().min(7).max(10).required(),
        isGold:Joi.boolean()
    })
    return schema.validate(input)
}

module.exports.Customer =Customer
module.exports.validateCustomer =validateCustomer;

