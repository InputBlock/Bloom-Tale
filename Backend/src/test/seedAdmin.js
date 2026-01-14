import dotenv from "dotenv"
dotenv.config({ path: './.env' })

import mongoose from "mongoose"
import bcrypt from "bcrypt"
import Admin from "../models/admin.model.js"
import { DB_NAME } from "../constants.js"

const seedAdmin = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("MongoDB connected")

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: "sample@gmail.com" })
        
        if (existingAdmin) {
            console.log("Admin already exists!")
            await mongoose.disconnect()
            return
        }

        // Hash password
        const password_hash = await bcrypt.hash("password", 10)

        // Create admin
        const admin = await Admin.create({
            email: "sample@gmail.com",
            password_hash: password_hash,
            is_admin: true
        })

        console.log("Sample admin created successfully!")
        console.log("Email: sample@gmail.com")
        console.log("Password: password")
        
        await mongoose.disconnect()
        console.log("MongoDB disconnected")
        
    } catch (error) {
        console.error("Error seeding admin:", error)
        process.exit(1)
    }
}

seedAdmin()
