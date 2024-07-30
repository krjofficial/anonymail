import {z} from 'zod';

// Validating username at runtime
export const usernameValidation = z
  .string()
  .min(2, "Username needs to be atleast 2 characters") // check if 2 or else error message
  .max(20, "Username can't be longer than 20 characters") 
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters")


export const signUpSchema = z.object({ // .object since multiple values exists
  username : usernameValidation,
  email: z.string().email({message: "Invalid email address"}),
  password: z.string().min(6, {message: "Password must be at least 6 characters"})
})  


