import asyncHandler from "../utilis/asyncHandler.js";
import ApiError from "../utilis/ApiError.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utilis/cloudinary.js";
import ApiResponse from "../utilis/ApiResponse.js";

const registerUser = asyncHandler( async (req, res) =>{
    // sending data 
    const {username, email, fullname, password} = req.body
    console.log("email:", email, "password:", password)

    // check validations for all fields
    if ([fullname, email, password, username].some((field)=>field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })

    if(existedUser){
        throw new ApiError(409, "User with email or username already existed")
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    const user =  await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url,
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while rigistering the user")
    }


    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )

})

export default registerUser
