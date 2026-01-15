import {userSchema} from "../models/user.model.js"

export async function getUserInfo() {
    const user=await userSchema.find();
    return{
        user:user.map(i=>({
            
        })
    }
}