
const mongoose = require('mongoose');
const config = require("config")
const database =config.get("db")

function mongodbconncetion(){
mongoose
  .connect(database)
  .then(() => {
    console.log(`Connected to MongoDB server ${database}...`);
  })
  .catch((err) => {
    console.log('Could not connect to MongoDB...');
  });
}

module.exports=mongodbconncetion;