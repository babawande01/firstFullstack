import mongoose from "mongoose";

// Define the user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    }
});

// Create the user model
const User = mongoose.models.User || mongoose.model("User", userSchema);

// Export the user model
export default User;