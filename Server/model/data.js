const mongoose = require( "mongoose");

const empSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    salary:{
        type:Number,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    image:{
            type:String,
            required:true,
    }
})


const empModel = mongoose.model(`employee`,empSchema)

module.exports= empModel;