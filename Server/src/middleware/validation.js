export const validation = (schema)=>{
    return (req , res , next)=>{
        let inputs = {...req.body , ...req.params , ...req.query};
        let {error} = schema.validate(inputs , {abortEarly : false});
        if(error){ 
            const errorMessage = error.details.map(detail => detail.message);
            const message = errorMessage[0].replace(/\"/g, "");
            res.status(400).json({message :message[0].toUpperCase()+message.slice(1)});
        }
        else next();
    }
}