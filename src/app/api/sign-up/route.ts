import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";



// connect to database
// get username email password from request 
// if username already exists then message: Username is already taken
// if email already exists then message: Email is already taken
// if email already does not exist then hash the password 
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

      const existingUserbyEmail = await UserModel.findOne({email})

      if(existingUserbyEmail) {
        true // todo:  back here
      }
      else {
        const hashedPassword = await bcrypt.hash(password, 10) 
        const expiryDate = new Date()
        expiryDate.setHours(expiryDate.getHours() + 1)
      }

    }
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