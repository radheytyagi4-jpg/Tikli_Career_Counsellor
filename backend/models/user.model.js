import mongoose from 'mongoose';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const userSchema = mongoose.Schema({

    userName:{
        type:String,
        required:true,
        lowerCase:true,
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        index:true
    },
    password:{
        type:String,
        required:true
    },
    otp:{
        type:String,
    },
    otpExpiry:{
        type:String
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    refreshToken:{
        type:String
    }

},{
    timestamps:true
})

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    // this.password = await bcrypt.hash(this.password, 10);

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt );
});


userSchema.methods.comparePassword = async function ( userPassword){
    return await bcrypt.compare(userPassword, this.password)
}

userSchema.methods.generateAccessToken = function (next){
    return jwt.sign({
        _id:this._id,
        userName:this.userName,
        email:this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn:process.env.ACCESS_TOKEN_EXPIRY}
)};

userSchema.methods.generateRefreshToken = function (next){
    return jwt.sign({
        _id:this._id,
        userName:this.userName,
        email:this.email
    },
    process.env.REFRESH_TOKEN_SECRET,
    {expiresIn:process.env.REFRESH_TOKEN_EXPIRY}
)}

export const User = mongoose.model("User", userSchema)