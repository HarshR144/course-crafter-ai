import NextAuth from "next-auth/next";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "./db"
import GoogleProvider from 'next-auth/providers/google'
import { getServerSession } from "next-auth"
export const authOptions = {
    session:{
        strategy:"jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
    adapter:PrismaAdapter(prisma),
    providers:[
            GoogleProvider({
                clientId:process.env.GOOGLE_CLIENT_ID,
                clientSecret:process.env.GOOGLE_CLIENT_SECRET
            }) 
        ],
    callbacks:{
        jwt: async ({token})=>{
            const db_user = await prisma.user.findFirst({
                where:{
                    email:token.email
                }
            })
            if(db_user){
                token.id = db_user.id
                token.credits = db_user.credits
            }
            return token
        },

        session: ({session,token})=>{
            if(token){
                session.user.id = token.id
                session.user.name = token.name
                session.user.email = token.email
                session.user.image = token.picture
                session.user.credits = token.credits
            }
            return session
        }

        
    },
    

}

export const getAuthSession = ()=>{
    return getServerSession(authOptions);
}
const handler = NextAuth(authOptions)
export {handler as GET, handler as POST}