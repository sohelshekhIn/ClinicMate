import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import Patient from "@/models/Patient";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET!,
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ account, profile, email }) {
      // @ts-ignore
      const emailVerified = profile.email_verified;
      if (!profile?.email || !emailVerified) {
        console.log("No Email or Email not verified");
        return false;
      }
      // check if user exists in db
      const patient = await Patient.findOne({ email: profile.email });
      // @ts-ignore
      const profilePicture = profile.picture;

      if (!patient) {
        try {
          // create user
          const newUser = new Patient({
            email: profile.email,
            name: profile.name,
            image: profilePicture,
          });
          await newUser.save();
          return true;
        } catch (error) {}
        return false;
      } else {
        // update user
        try {
          const patient = await Patient.findOneAndUpdate(
            { email: profile.email },
            {
              name: profile.name,
              image: profilePicture,
            },
            { new: false }
          );
          return true;
        } catch (error) {
          return false;
        }
      }
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
