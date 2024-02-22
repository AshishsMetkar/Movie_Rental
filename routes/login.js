const express = require('express');
const router = express.Router();
router.use(express.json());
const Joi = require("joi");
const {User} =require("../models/user")
const bcrypt=require("bcrypt");
const config = require("config")
const auth = require("../middleware/auth")
const jwt = require("jsonwebtoken")


router.get("/",auth,function(req,res){
   res.status(200).send("Authenticated")
})


router.post('/', async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  let user  =await User.findOne({email:req.body.email})
  if (!user) return res.status(400).send("Invalid email or password");

  let isValid =await bcrypt.compare(req.body.password, user.password);
  if (!isValid) return res.status(400).send("Invalid email or password");
console.log(config.get("password"));

const token = jwt.sign({_id:user._id, isAdmin:user.isAdmin},config.get("password"))

  res.send(token);
});

function validate(input){
    const schema = Joi.object({
    
        email:Joi.string().min(5).max(255).required(),
        password:Joi.string().min(5).max(1024).required()
    })
    return schema.validate(input)
}


module.exports = router;

