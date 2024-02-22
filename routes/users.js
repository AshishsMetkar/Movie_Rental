const express = require('express');
const _ = require("lodash")
const router = express.Router();
router.use(express.json());
const { User, validateUser } = require('../models/user');
const bcrypt =require("bcrypt");
const auth = require("../middleware/auth")
const admin = require("../middleware/admin")
const isValidObjectId=require('../middleware/validateObjectId')
const nodemailer = require("nodemailer")

router.get('/', async (req, res) => {
  const user = await User.find();
  res.send(user);
});

router.get('/:id', isValidObjectId,async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) return res.status(400).send('Could not find the user.');

  res.send(user);
});

router.post('/',async (req, res) => {  
  const { error } = validateUser(req.body);

  if (error) return res.status(400).send(error.details[0].message);
 
  let user = await User.findOne({email: req.body.email});
  if(user) return res.status(400).send("User Already registered");

  user = new User({ name: req.body.name, 
    email:req.body.email, 
    password:req.body.password ,
    isAdmin:req.body.isAdmin,
    
  }); 

  user.password= await bcrypt.hash(user.password, 10)
  await user.save();

  res.send(_.pick(user,["_id","name","email","isAdmin"]));

var transport = nodemailer.createTransport(
    {
        service: 'gmail',
        auth: {
            user: 'ashishsmetkar44@gmail.com',
            pass: "sjqtienlnzqfemzh"
        }
    }
)
//send out email
let mailoptions = {
    from : 'ashishsmetkar44@gmail.com',
    to : `${req.body.email}`,
    subject: 'Hello Sending mail with nodemailer ',
    html:`<h3> You have successfully register in our app</h3> </br>
        <p>Your email is ${req.body.email} and your password is <b style="color:green">${req.body.password} <u> Ashish Metkar</u> </b></p>`

}

transport.sendMail(mailoptions, function(error, info){
    if(error){
        console.log(error)
    }else{
        console.log("Email sent" + info.response);
    }
   })

});

router.put('/:id',auth,isValidObjectId, async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { 
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      isAdmin: req.body.isAdmin
    },{
      new:true
    }
  );

  if (!user) return res.status(404).send('The user with the given ID was not found.');

  res.send(user);
});

router.delete('/:id',auth,admin,isValidObjectId, async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
  
    if (!user) return res.status(404).send('The user with the given ID was not found.');
  
    res.send(user);
});

module.exports = router;
