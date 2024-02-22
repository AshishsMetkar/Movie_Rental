
const genres = require("../routes/genres")
const customers = require("../routes/customers")
const users = require("../routes/users")
const movies =require("../routes/movies")
const rentals = require("../routes/rentals")
const logins = require("../routes/login");

function route(app){
app.use('/api/genres', genres);
app.use("/api/customers",customers);
app.use("/api/users",users);
app.use("/api/movies",movies);
app.use("/api/rentals",rentals);
app.use("/api/logins",logins)
}
module.exports=route;