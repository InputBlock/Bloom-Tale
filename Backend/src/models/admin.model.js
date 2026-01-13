import mongoose from "mongoose";

const{Schema}=mongoose;

const adminSchema=new Schema({
    email:{type:String , require:true , index:true},
    password_hash:{type : String  , require :true},
    is_admin:{type:Boolean , default:false}
})

export default mongoose.model("Admin",  adminSchema);