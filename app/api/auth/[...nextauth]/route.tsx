import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { connectToDB } from 'utils/database';
import User from 'models/user';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          hd: "seas.upenn.edu"
        }
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  callbacks: {
    async session({ session }) {
        const sessionUser = await User.findOne({
          email: session.user.email,
        });
        if (sessionUser) {
          session.user.id = sessionUser._id.toString();
        }
    
        return session;
      },
      async signIn({ profile }) {
        if (!profile?.email?.endsWith("@seas.upenn.edu")) {
          return false;
        }
        try {
          await connectToDB();
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
          return true;
        } catch (error) {
          console.log(error);
          return false;
        }
      }
  }
});

export { handler as GET, handler as POST };