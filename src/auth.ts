
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import "next-auth/jwt"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email" },
        password: { label: "Password", type: "password" },
        access_token: { label: "Access Token"},
      },

      async authorize(credentials) {

        if(credentials?.access_token) {
          const userResponse = await fetch(`${process.env.API_URL}/api/user`, {
              method: 'GET',
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${credentials.access_token}`,
              },
          });

          const userData = await userResponse.json();

          if(userResponse.ok && userData) {
            return {
              id: userData.id,
              name: userData.name,
              email: userData.email,
              accessToken: credentials.access_token,
            };
          }
        }
        
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const loginResponse = await fetch(`${process.env.API_URL}/api/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        const data = await loginResponse.json();

        if (loginResponse.ok && data.success) {
          return {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            accessToken: data.access_token,
          };
        }
        return null;
      },
    }),
  ],
  trustHost: true,
  callbacks: {

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id ?? "default id";
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
});