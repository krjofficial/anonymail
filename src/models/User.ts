import mongoose, {Schema, Document} from "mongoose";


// Message Mongoose Model 
export interface Message extends Document {
  // Defines a new TypeScript interface named Message
  // Interfaces in TypeScript are used to define the shape of objects.
  // allows the Message interface to inherit properties and methods from the Document interface, which is typically used to represent MongoDB documents managed by Mongoose models.
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema ({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
})


// User Mongoose Model

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: Message[]; // Message documents are inherited into an array from Message 
}

const UserSchema: Schema<User> = new Schema ({
  username: {
    type: String,
    required: [true, "Username is required"], // Boolean value + Error message
    trim: true,
    unique: true

  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, 'please use a valid email address']  // Regex pattern for verifying email and throwing an error if it does not match
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  verifyCode: {
    type: String,
    required: [true, "Verification Code is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verification Code of Expiry is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  messages: [MessageSchema] // messages is of array type and elements are of type MessageSchema
})


// const model = (if model does not exist then create new model) || (if model exists then fetch)

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

// <User> represents the type of interface

export default UserModel;