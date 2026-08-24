import mongoose from 'mongoose'

const historySchema = new mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    prompt:{
        type:String,
        required:true
    },
    subject:{
        type:String,
        required:true
    },
    response:{
        type:String,
        required:true
    }

},{
    timestamps:true
})

export const History = mongoose.model("History", historySchema);