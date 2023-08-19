import { Schema, model, models, Document, Types } from "mongoose";

interface IUser extends Document {
  email: string;
  username: string;
  image: string;
  attending: Types.ObjectId[];
}

const UserSchema = new Schema({
  email: {
    type: String,
    unique: [true, "Email already exists!"],
    required: [true, "Email is required!"],
  },

  username: {
    type: String,
    required: [true, "User name is required!"],
  },

  image: {
    type: String,
  },

  attending: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
  },
});

const User = models.User || model("User", UserSchema);

export default User;
