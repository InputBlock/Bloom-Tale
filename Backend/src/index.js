import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({
    path: path.resolve(__dirname, '../.env')
})
import {app} from './app.js'


//require('dotenv').config({path:'./env'})

import connectDB from "./db/index.js";

let server;

const startServer = async () => {
  try {
    await connectDB();

    server = app.listen( process.env.PORT || 8000  , () => {
      console.log(`Server running at port ${process.env.PORT}`);
    });

  } catch (err) {
    console.error("Startup failed ❌", err);
    process.exit(1);
  }
};

startServer();

// 🛑 Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);

  if (server) {
    server.close(async () => {
      console.log("HTTP server closed");

      try {
        await mongoose.connection.close(false);
        console.log("MongoDB connection closed");
        process.exit(0);
      } catch (err) {
        console.error("Shutdown error", err);
        process.exit(1);
      }
    });
  }

  setTimeout(() => {
    console.error("Force shutdown ❌");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);




/*
connectDB()  //ye async use kiye hai to promise bhi return karega isliye
.then(()=>{
    app.listen(process.env.PORT || 8080,()=>{
        console.log(`Server is running at port :${process.env.PORT}`);
        
    })
})
.catch((err)=>{
    console.log("MONGODB connection failed !!!",err);
    
})

*/

