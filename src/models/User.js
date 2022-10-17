import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  password: { type: String },
  avatarUrl: { type: String },
  socialOnly: { type: Boolean, default: false },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  location: { type: String },
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 5);
  console.log("Users Hashed password:", this.password);
});

const User = mongoose.model("User", userSchema);
export default User;
