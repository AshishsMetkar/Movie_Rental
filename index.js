const express = require('express');
require("express-async-errors")
const config = require("config")
const cors = require("cors")
const app = express();
const path = require('path')

const mongoose = require('mongoose');

app.use(express.json());

const mongodbconncetion= require("./startup/database");
const logs = require("./startup/loggingerrors")
const route=require('./startup/routes');
const errors =require("./middleware/errorhandling")
const port = require("./startup/port")
app.use(errors);

app.use(cors())

if(!config.get("password")){
  console.log("jwtPrivateKey is not set");
}

// line no 25 to 39 const buildPath = path.join(__dirname, "D:", "Movie_rental", "Movie-Rentals-Frontend", "build");
const buildPath = "D:\\Movie_rental\\Movie-Rentals-Frontend\\build";
app.use(express.static(buildPath));

app.get("/", function(req, res){

  res.sendFile(
    path.join(buildPath, "index.html"),
    function(err){
      if (err){
        res.status(500).send(err);
      }
    }
  )
})
mongoose.connect('mongodb://127.0.0.1:27017/movie_rentals')
.then(() => {
  console.log(`Connected to MongoDB server`);
})
.catch((err) => {
  console.log('Could not connect to MongoDB...');
});
// mongodbconncetion();
port(app);
route(app);
logs();

module.exports =app   