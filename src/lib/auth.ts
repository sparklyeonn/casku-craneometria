import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "./prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        rut: { label: "RUT del paciente", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.rut) return null

        const paciente = await prisma.paciente.findUnique({
          where: { rut: credentials.rut as string },
        })

        if (!paciente) return null

        return {
          id: paciente.id,
          name: paciente.nombre,
          rut: paciente.rut,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.rut = (user as any).rut
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        ;(session.user as any).rut = token.rut
      }
      return session
    },
  },
})