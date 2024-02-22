const mongoose = require("mongoose");
const Joi =require("joi");
Joi.objectId =require("joi-objectid")(Joi);

const rentalSchema =  new mongoose.Schema({

        movie:{
            type:{
            _id:mongoose.Schema.Types.ObjectId,
            title:{
                type:String,
                minLength:[5,"Please enter minimum 5 characters"],
                maxLength:[50,"Please enter maximum 50 characters"],
                required:true
            },

        dailyRentalRate:{
            type:Number,
            min:[0,"Please enter number gretaer than 0"],
            required:true
        },
        numberInStock:{
            type:Number,
            min:[0,"Please enter number gretaer than 0"],
            required:true
        },
    },required:true,
    },
    customer:{
        type:{
            _id:mongoose.Schema.Types.ObjectId,
            name:{
                type:String,
                minLength:[5,"Please enter minimum 5 characters"],
                maxLength:[50,"Please enter maximum 50 characters"],
                required:true
            },
            phone:{
                type:String,
                minLength:[7,"Please enter minimum 7 numbers"],
                maxLength:[10,"Please enter maximum 10 numbers"],
                required:true  
            }
        },
        required:true
    },
    rentalFee:{
     type:Number,
     min:0,
     required:true
    },
    dateOut:{
        type:Date,
        default: new Date(),
    },
    dateIn: Date,
});

const Rental= mongoose.model("Rental",rentalSchema);


function validateRental(input){
    const schema = Joi.object({
        customerId:Joi.objectId().required(),
        movieId:Joi.objectId().required(),    
    })
    return schema.validate(input)
}

module.exports.Rental =Rental
module.exports.validateRental =validateRental;

