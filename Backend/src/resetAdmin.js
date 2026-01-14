import dotenv from "dotenv"
dotenv.config({ path: './.env' })

import mongoose from "mongoose"
import bcrypt from "bcrypt"
import Admin from "./models/admin.model.js"
import { DB_NAME } from "./constants.js"

const resetAdmin = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("MongoDB connected")

        // Delete existing admin
        await Admin.deleteMany({})
        console.log("Deleted all existing admins")

        // Hash password
        const password_hash = await bcrypt.hash("admin123", 10)

        // Create new admin
        const admin = await Admin.create({
            email: "admin@sample.com",
            password_hash: password_hash,
            is_admin: true
        })

        console.log("✅ Admin created successfully!")
        console.log("Email: admin@sample.com")
        console.log("Password: admin123")
        
        await mongoose.disconnect()
        console.log("MongoDB disconnected")
        process.exit(0)
        
    } catch (error) {
        console.error("Error resetting admin:", error)
        process.exit(1)
    }
}

resetAdmin()
