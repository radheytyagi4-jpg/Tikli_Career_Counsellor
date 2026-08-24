import OpenAI from "openai";
import asyncHandler from '../utils/asyncHadler.js'
import ApiError from '../utils/ApiError.js'
import { User } from '../models/user.model.js'
import { History } from '../models/history.model.js'
import ApiResponse from '../utils/ApiResponse.js'
import sendMail from '../utils/sendMail.js'

const userRegister = asyncHandler(async (req, res, next) => {

    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
        throw new ApiError(400, "all fields are required");
    }

    const existedUser = await User.findOne({ email });
    if (existedUser) throw new ApiError(401, "user already exist");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({ userName, email, password, otp, otpExpiry });

    if (!user) throw new ApiError(500, "something went wrong while registering");

    try {
        await sendMail({
            to: email,
            subject: "Your OTP code for AI Response Generator",
            text: `Your OTP is ${otp}. It is valid for 10 minutes only.`
        });
    } catch (emailError) {
        await User.findByIdAndDelete(user._id);
        console.log("email sending failed:", emailError);
        throw new ApiError(500, "failed to send OTP email, please try again");
    }

    res.status(201).json(new ApiResponse(201, {}, "user created, OTP sent to email"));
});


const userLogin = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body;

    if (!email || !password) throw new ApiError(400, "email and password are required");

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(401, "user is not registered");

    if (!user.isVerified) {
        throw new ApiError(403, "please verify your email before logging in");
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) throw new ApiError(400, "invalid email or password");

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const loggedInUser = await User.findById(user._id).select("-password -otp -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
    };

    res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "login successful")
        );
});


const userVerify = asyncHandler(async (req, res) => {

    const { email, otp } = req.body;

    if (!email || !otp) throw new ApiError(400, "email and otp are required");

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "user not found");

    if (user.isVerified) throw new ApiError(400, "user already verified");

    if (user.otpExpiry < new Date()) {
        throw new ApiError(400, "otp expired, please register again");
    }

    if (user.otp !== otp) throw new ApiError(401, "invalid otp");

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json(new ApiResponse(200, {}, "email verified successfully"));
});


const responseGenerater = asyncHandler(async (req, res) => {

    const { prompt } = req.body;

    if (!prompt) throw new ApiError(400, "prompt is required");

    const systemPrompt = `You are a response generator. Based on the user's prompt, reply ONLY with valid JSON in this exact format: {"subject": "a short subject line", "response": "your full response to the prompt"}. Do not include any text outside the JSON.`;

    const client = new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: "https://api.groq.com/openai/v1",
    });

    const aiResponse = await client.responses.create({
        model: "openai/gpt-oss-20b",
        input: systemPrompt + "\n\nUser prompt: " + prompt,
    });

    let subject, response;
    try {
        const parsed = JSON.parse(aiResponse.output_text);
        subject = parsed.subject;
        response = parsed.response;
    } catch (parseError) {
        subject = "Generated Response";
        response = aiResponse.output_text;
    }

    const history = await History.create({
        user: req.user._id,
        prompt,
        subject,
        response
    });

    if (!history) throw new ApiError(500, "something went wrong while generating response");

    res.status(201).json(new ApiResponse(201, history, "response generated successfully"));
});


export {
    userRegister,
    userLogin,
    userVerify,
    responseGenerater
}