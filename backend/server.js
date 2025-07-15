import express from 'express';
import { connectToDB } from './config/db.js';
import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from './models/user.model.js'; // Ensure you have a user model defined
import cookieParser from 'cookie-parser';
import cors from 'cors';


dotenv.config(); // Load environment variables from .env file

const app = express();
const cors = require('cors'); // Import CORS for handling cross-origin requests

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies
app.use(cors({ origin: process.env.CLIENT_URl, credentials: true })); // Enable CORS for all routes

const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  next();
});
// Middleware to handle CORS preflight requests

app.get('/', (req, res) => {
  res.send('Subscribe to my Channel!');
  
});

//creating sigup API
app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;
    try {
        // Validate input
        if (!username || !email || !password) {
            throw new Error("All fields are required");
        }

        const emailExists = await User.findOne({ email })

        if (emailExists) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Create a new user
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.status(400).json({ message: "Username is Taken try another name" });
        }

        //create password hash
        const hashedPassword = await bcryptjs.hash(password, 10);

        const userDoc = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        // Generate JWT token
       if (userDoc) {
            // jwt.sign() takes payload, secret key, and options
            // Here, we are signing the user ID as the payload
            const token = jwt.sign({id: userDoc._id}, process.env.JWT_SECRET, {
                expiresIn: '7d',
            })

            //send cookie to the client
            res.cookie('token', token, {
                httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
                secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                sameSite: 'Strict', // Helps prevent CSRF attacks
                
            })
       }

    



         return res.status(200).json({ user: userDoc, message: "User created successfully." });
    } catch (error) {
        res.status(400).json({ message: error.message });

    }
});


//creating login API
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Validate input

    const userDoc = await User.findOne({ username });
    if (!userDoc) {
      return res.status(400).json({ message: "Invalid username" });
    }
    // Check password compare the two password with the one eneter and the one at the database
    const isPasswordValid = await bcryptjs.compareSync(password, userDoc.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: userDoc._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // Send cookie to the client
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });

    return res.status(200).json({ user: userDoc, message: "Login successful." });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(400).json({ message: error.message });
  }
});


// fetch user API
app.get('/api/fetch-user', async (req, res) => {
    // Get the token from the cookie
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "NO Token provided Unauthorized" });
    }

    try {
        // decode the token to get user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded || !decoded.id) {
            return res.status(401).json({ message: "Invalid token" });
        } 

        // If the token is valid, proceed to fetch user
        const userId = decoded.id;
        const userDoc = await User.findById(userId).select('-password'); // Exclude password from response
        if (!userDoc) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // if the check are completed successfully, we can proceed to fetch the user
        res.status(200).json({ user: userDoc });


    } catch (error) {
        console.log("Error in fetching user: ", error.message);
        return res.status(400).json({ message: error.message });

    }

});

// Logout API
app.post('/api/logout', async (req, res) => {
    // Clear the cookie by setting it to an empty value and an expiration date in the past
    res.clearCookie('token')
    return res.status(200).json({ message: "Logout successful" });
})

app.listen(PORT, () => {
    connectToDB(); // Ensure you have imported connectToDB from your db.js file
  console.log(`Server is running on http://localhost:${PORT}`);
});


export default app;