import { Schema, model, models, Document, Types } from "mongoose";

// interface IUser extends Document {
//   //from google email
//   email: string;
//   firstName: string; profile.name.split(" ")[0]
//   lastName: string; profile.name.split(" ")[1]
//   googleProfileImage: string;
//
//   // from user input
//   userUpdatedProfileImage: string; // if user uploads profile image
//
//   closestMainCity: string;
//   gender: string;
//   bio: string;
//   classesTaken: Array<string>;
//   fieldsOfInterest: Array<string>;
//   attendingEvents: Types.ObjectId[];
// }

const UserSchema = new Schema({
  email: {
    type: String,
    unique: [true, "Email already exists!"],
    required: [true, "Email is required!"],
  },

  firstName: {
    type: String,
    required: [true, "First name is required!"],
  },

  lastName: {
    type: String,
    required: [true, "Last name is required!"],
  },

  closestMainCity: {
    type: String,
  },

  timeZone: {
    type: String,
  },

  gender: {
    type: String,
  },

  bio: {
    type: String,
  },

  classesTaken: {
    type:[String],
  },

  fieldOfInterest: {
    type: [String],
  },

  googleProfileImage: {
    type: String,
  },

  userUpdatedProfileImage: {
    type: String,
  },

  attendingEvents: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
  },
});

const User = models.User || model("User", UserSchema);

export default User;
