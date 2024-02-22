const express = require('express');
require("express-async-errors")
const config = require("config")
const cors = require("cors")
const app = express();

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