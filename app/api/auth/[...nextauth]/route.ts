import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
// import { PrismaAdapter } from "@auth/prisma-adapter"
// import { PrismaClient } from "@prisma/client"
// const prisma = new PrismaClient()

const handler = NextAuth({
  // adapter: PrismaAdapter(prisma), // TODO: Uncomment when DATABASE_URL is set in .env.local
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "ทดลองพิมพ์อะไรก็ได้" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Mock Login: ยอมรับทุกการล็อกอินเพื่อทำ Demo
        if (credentials?.username) {
          return { id: "1", name: credentials.username, email: `${credentials.username}@example.com`, image: "/developer.png" }
        }
        return null
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt", // Use JWT for mock, change to "database" if using Prisma
  },
  secret: process.env.NEXTAUTH_SECRET || "nexora-secret-key-for-dev",
})

export { handler as GET, handler as POST }
