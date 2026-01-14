import adminSchema from "../models/admin.model.js";
import { createAccessToken } from "../utils/jwtHelper.js";
import bcrypt from "bcrypt";

export async function AdminDecorator(ctx) {
    if (!ctx.email || !ctx.password) {
        throw new Error("Invalid credentials");
    }
    
    const admin = await adminSchema.findOne({ email: ctx.email.toLowerCase() });

    if (!admin) {
        throw new Error("Invalid credentials");
    }
    if (!admin.is_admin) {
        throw new Error("Admin access required");
    }

    const password_ok = await bcrypt.compare(ctx.password, admin.password_hash);
    
    if (!password_ok) {
        throw new Error("Invalid credentials");
    }
    
    return {
        token: createAccessToken(admin._id, "admin"),
        admin: {
            id: admin._id,
            email: admin.email,
            is_admin: admin.is_admin
        }
    };
}

export default AdminDecorator;

