const bcrypt =require("bcrypt");
const config = require("config")
async function hash(){
    const salt = await  bcrypt.genSalt(10);
    console.log(salt);
    const result = await bcrypt.hash(config.get("password"),salt);
    console.log(result);
}

hash();