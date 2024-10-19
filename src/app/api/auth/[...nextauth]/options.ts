
import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

export const options: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string, // `as string` is an assertion in TS
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",

      // define how the credentials object should look like
      // this will be used by next to request certain credentials from the user
      credentials: {
        username: {
          label: "Username:",
          type: "text",
          placeholder: "username",
        },
        password: {
          label: "Password:",
          type: "text",
          placeholder: "password",
        }
      },

      async authorize(credentials) {
        // This is where credentials are checked and validated
        // @param credentials - will have the same fields as the credentials object defined above in CredentialsProvider
        // Docs: https://next-auth.js.org/configuration/providers/credentials
        // using a hardcoded user for now...
        const user = { id: "42", name: "patrick", password: "nextauth" };
        // finalized version will check against user stored in prisma
        // using hardcoded checks...
        if (credentials?.username === user.name && credentials.password === user.password) {
          return user;
        } else {
          return null;
        }
      }
    })
  ],
}