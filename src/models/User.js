import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  githubLoginOnly: { type: Boolean },
  username: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String, required: true },
  avatarUrl: { type: String },
  location: { type: String },
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 5);
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
