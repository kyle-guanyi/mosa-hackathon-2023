import { Schema, model, models, Document, Types } from "mongoose";

/**
 * User Schema
 */
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

  userUploadedPictures: {
    type: [String], // Array of strings
  },
});

// Export the model and return your IUser interface
const User = models.User || model("User", UserSchema);

export default User;
