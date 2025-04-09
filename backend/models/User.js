import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    profileImage: {
      type: String,
      default: "", // can also be a default Cloudinary placeholder if you want
    },
  },
  { timestamps: true }
); // Automatically add createdAt & updatedAt timestamps ;



userSchema.pre("save",async function (next){
    if(!this.isModified("password")) return next();
    this.password= await bcrypt.hash(this.password,10);
    next()
})
userSchema.methods.matchPassword= async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

const User= mongoose.model("User",userSchema);
export default User;