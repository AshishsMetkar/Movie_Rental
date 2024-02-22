
const winston =require("winston")

function logs(){
    winston.configure({
        transports:[
          new winston.transports.Console(),
          new winston.transports.File({filename:"logfile.log"}),
      ],
      })
      
      process.on("uncaughtException",(err)=>{
          winston.error("we have uncaught exception "+err.message);
          setTimeout(()=>{
              process.exit(1);
      
          },2000)
      })
      process.on("unhandledRejection",(err)=>{
          winston.error("unhandled rejection"+err.message);
          setTimeout(()=>{
              process.exit(1);
          },2000)
      })
}


module.exports = logs;
