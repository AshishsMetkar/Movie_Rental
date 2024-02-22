const mongoose = require("mongoose");
const Joi =require("joi");
Joi.objectId =require("joi-objectid")(Joi);

// const {genreSchema} =require("./genre")
const movieSchema =  new mongoose.Schema({

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
        genre:{
            // type:genreSchema,
            _id:String,
            name:String
        },
        liked:{
            type:Boolean,
            default:false
        }

})
const Movie= mongoose.model("Movie",movieSchema);

function validateMovie(input){
    const schema = Joi.object({
        title:Joi.string().min(5).max(50).required(),
        dailyRentalRate:Joi.number().min(0).required(),
        numberInStock:Joi.number().min(0).required(),
        genre_id:Joi.objectId().required(),
        liked:Joi.boolean()
    })
    return schema.validate(input)
}

module.exports.Movie =Movie
module.exports.validateMovie =validateMovie;

