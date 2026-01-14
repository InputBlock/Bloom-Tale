import mongoose from "mongoose";

const{Schema}=mongoose;

const adminSchema=new Schema({
    email:{type:String , required:true , unique:true, index:true},
    password_hash:{type : String  , required :true},
    is_admin:{type:Boolean , default:false}
}, { timestamps: true })

export default mongoose.model("Admin",  adminSchema);