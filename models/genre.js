const mongoose = require("mongoose");
const Joi =require("joi")
const genreSchema =  new mongoose.Schema({

        name:{
            type:String,
            minLength:[5,"Please enter minimum 5 characters"],
            maxLength:[50,"Please enter maximum 50 characters"],
            required:true
        }
})
function validateGenre(input){
    const schema = Joi.object({
        name:Joi.string().min(5).max(50).required()
    })
    return schema.validate(input)
}

module.exports.Genre = mongoose.model("Genre",genreSchema)
module.exports.validateGenre =validateGenre;

