import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";



// connect to database
// get username email password from request 
// if username already exists then return and message: Username is already taken
// if email is taken 
//        and email is verified
//            return
//            message: Email is already taken
//        if email is not verified 
//            hash the password and store it
//            assign the verification code with the expiration time 
// if email is not already taken
//        hash the password and store it
//        assign the verification code with the expiration time
 
 export async function POST(request: Request){ // async since connecting to db 
  // request is of Request Datatype both part of Next Js

  await dbConnect();  // this will return a promise 
  // either db will connect or throw an error

  try {
    const {username, email, password} = await request.json()
    const existingUserVerifiedByUsername = await UserModel.findOne({ // Check if user exists and is verified
      username,
      isVerified: true,
    }) // returns a boolean value

    if(existingUserVerifiedByUsername) { 
      return Response.json({
        success: false,
        message: 'Username is already taken.'
      }, {status: 400}) 

    }

      const existingUserbyEmail = await UserModel.findOne({email})
      const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
      // The line of code you provided generates a random 6-digit verification code and converts it to a string.

      if(existingUserbyEmail) {
        if (existingUserbyEmail.isVerified) { // if user already exists and email is verified
          return Response.json({
            success: false,
            message: 'User Already exists with this email address'
          }, {status: 400})
        } else { // if user already exists but email is not verified
          const hashedPassword = await bcrypt.hash(password, 10)
          existingUserbyEmail.password = hashedPassword;
          existingUserbyEmail.verifyCode = verifyCode;
          existingUserbyEmail.verifyCodeExpiry = new Date(Date.now() + 3600000) // expiration time is set to 1 hour

          await existingUserbyEmail.save()
        }
      }
      else {
        const hashedPassword = await bcrypt.hash(password, 10) 
        const expiryDate = new Date()
        expiryDate.setHours(expiryDate.getHours() + 1) // expiry date is set to an hour after the current time
        // expiryDate is declared as constant...
        // Still it can be changed because of the new keyword
        // new Date() provides an object 
        // object is just a reference point in memory and therefore it can be changed

        const newUser = new UserModel({
          username,
          email,
          password: hashedPassword,
          verifyCode,
          verifyCodeExpiry: expiryDate,
          isVerified: false,
          isAcceptingMessage: true,
          messages: []
        })

        await newUser.save()
      }

      // send verfication email 
      const emailResponse = await sendVerificationEmail(
        email, 
        username, 
        verifyCode
      ) 

      if(!emailResponse.success) {
        return Response.json({
          success: false,
          message: emailResponse.message
        }, {status: 500})
      }
      return Response.json({
        success: true,
        message: "User Registered successfully. Please verify you email"
      }, {status: 201})

    
  } catch (error) {
    console.error("Error registering User", error); // at terminal
    return Response.json( // at frontend 
      {
        success: false,
        message: "Error registering User"
      }, 
      {
        status: 500 // status code is always sent as a seperate object
      }
    )
  }





 }