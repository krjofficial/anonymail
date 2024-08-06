// Part of Next Auth Js

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// Replace Credentials with any provider you want
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { userAgentFromString } from "next/server";


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      }, // Next Auth will create a html form with these fields
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              {email: credentials.identifier},
              {username: credentials.identifier}
            ]
          })
          if (!user) {
            throw new Error("No user Found with this email")
          }

          if (!user.isVerified) {
            throw new Error("Please verify your account Before login")
          }

          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

          if (isPasswordCorrect) {
            return user
          } else {
            throw new Error("Incorrect Password")
          }

        } catch (err: any) {


          
        }
      }
    })
  ]
}