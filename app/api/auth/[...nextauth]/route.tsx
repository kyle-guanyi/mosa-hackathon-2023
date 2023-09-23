// @ts-nocheck
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "../../../../utils/database";
import User from "../../../../models/user";

/**
 * This file is used to configure the NextAuth.js library.
 * It is used to configure the authentication providers and callbacks.
 */
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          hd: "seas.upenn.edu",
        },
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  callbacks: {
    /**
     * This function is called whenever a user is logged in.
     * It is used to add the user's id to the session.
     *
     * @param session - The current session object
     * @returns session - The updated session object
     */
    async session({ session }) {
      const sessionUser = await User.findOne({
        email: session.user.email,
      });
      // Add the user's id from the database to the session
      if (sessionUser) {
        session.user.id = sessionUser._id.toString();
      }

      return session;
    },
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/?callbackUrl=${encodeURIComponent(url)}`;
    },
    /**
     * This function is called whenever a user is logged in.
     * It is used to check if the user is a Penn student.
     *
     * @param profile
     * @returns true if the user is a Penn student, false otherwise
     */
    async signIn({ profile }) {
      // Check if the user has Upenn email address
      if (!profile?.email?.endsWith("@seas.upenn.edu")) {
        return false;
      }
      try {
        await connectToDB();
        const callbackUrl = query.callbackUrl ? decodeURIComponent(query.callbackUrl) : "/home";
        //check if user already exists
        const userExists = await User.findOne({
          email: profile.email,
        });
        //if not, create new user
        if (!userExists) {
          await User.create({
            email: profile.email,
            firstName: profile.name.split(" ")[0], // Extract first name
            lastName: profile.name.split(" ")[1], // Extract last name
            googleProfileImage: profile.picture,
            userUpdatedProfileImage: null,
            closestMainCity: "",
            timeZone: "",
            gender: "",
            bio: "",
            classesTaken: [],
            fieldOfInterest: [],
            attendingEvents: [],
          });
        }
        return callbackUrl;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
