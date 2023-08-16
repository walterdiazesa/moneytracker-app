import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (!account || account.provider !== "google" || !profile) return false;
      return JSON.parse(process.env.AUTH_WHITE_LIST!).includes(profile.email);
    },
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      session.user = token as any;
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 5 * 12 * 30 * 24 * 60 * 60, // Five years
  },
  secret: process.env.NEXTAUTH_SECRET,
};
export default NextAuth(authOptions);
