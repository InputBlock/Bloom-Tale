import AdminDecorator from "../../admin/decorator.admin.js"

const admin_login=async(req ,res,next)=>{
    try{
        const ctx={
            email:req.body.email,
            password:req.body.password
        };
        const result=await AdminDecorator(ctx);

        res.json(result);
    } catch(err){
        next(err);
    }
}

export default admin_login;