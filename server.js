const app = require("./app")
const dotenv = require('dotenv')
const path = require('path')
const connectDatabase = require('./Config/database')



dotenv.config({path: path.join(__dirname, "Config/config.env")})



connectDatabase ();

const server =app.listen(process.env.PORT,() => {
   
    console.log(`My server is Listening @ http://localhost:${process.env.PORT} in ${process.env.NODE_ENV}`)
})

process.on('unhandledRejection', (err)=>{ //aenga aenga promise error catch pannama vdutho athu ellam enga vanthu kattirum
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to unhandled rejection`)
    server.close(()=>{
        process.exit(1) //it will help to stop the node prrogram
    })
})

process.on('uncaughtException', (err)=>{ //aenga aenga promise error catch pannama vdutho athu ellam enga vanthu kattirum
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to uncaughtException`)
    server.close(()=>{
        process.exit(1) //it will help to stop the node prrogram
    })
})
// console.log(a);