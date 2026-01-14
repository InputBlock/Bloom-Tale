import dotenv from "dotenv"
dotenv.config({
    path:'./.env'
})
import {app} from './app.js'


//require('dotenv').config({path:'./env'})

import connectDB from "./db/index.js";



connectDB()  //ye async use kiye hai to promise bhi return karega isliye
.then(()=>{
    app.listen(process.env.PORT || 8080,()=>{
        console.log(`Server is running at port :${process.env.PORT}`);
        
    })
})
.catch((err)=>{
    console.log("MONGODB connection failed !!!",err);
    
})

