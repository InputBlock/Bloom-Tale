import {getUserInfo} from "../../admin/status.js"

const get_user_info=async(req , res)=>{
    try{
      const data=await getUserInfo();

      return res.status(200).json(data);
    }catch(err){
        return res.status(500).json({error:err.message});
    }   

}

export {get_user_info};