const bcrypt = require("bcrypt");
const { generateToken } = require("../config/jwt");
const User = require("../models/userModel");
const nodemailer = require("nodemailer");
const { default: mongoose } = require("mongoose");


const signup = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|net|org|edu)$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message:
          " Invalid email! Must contain @ and end with .com, .net, .org, or .edu",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        status: false,
        message:
          " Weak password! 8 characters long, 1 uppercase, 1 lowercase, 1 number, and 1 special character.",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log("hashed Password", hashedPassword);

    const newUser = new User({ name, email, password: hashedPassword, phone });
    const saveUsers = await newUser.save();
    console.log("saveUser", saveUsers);

    const token = generateToken({ id: saveUsers._id });

    const saveToken = await User.findOneAndUpdate({
      _id: new mongoose.Types.ObjectId(saveUsers._id),
      token: token,
    });


    await sendEmail(email);

    res.status(201).json({ status: true, message: "Signup successful", data: token, });
  } catch (error) {
    console.log("Error in signup", error);
    res.status(500).json({ status: false, error: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({status: true, error: "Invalid credentials" });
    }

    const token = existingUser.token;
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        phone: existingUser.phone,
      },
    });
  } catch (error) {
    console.error("Error in login", error);
    res.status(500).json({status: false,  error: "Server error" });
  }
};


const sendEmail = async (email) => {
    try {
      console.log("email", email);
  
      const transporter = nodemailer.createTransport({
        // host: "smtp.gmail.com",
        service: "gmail",
        secure: true,
        port: 465,
        auth: {
            user: "sheikhsneha0806@gmail.com", // Secure way
            pass: "twaymzffgjqhipcj" // Ensure this is an App Password
        },
      });

  
      await transporter.sendMail({
        from: "snehaskheikh0806@gmail.com",
        to: email, 
        subject: `Welcome! to our platform`,
        html: `
                <div style="text-align:center; font-family:Arial,sans-serif; padding:20px;">
                    <img src="https://yourcompany.com/logo.png" alt="Logo" width="150">
                    <h2>Welcome to Our Platform!</h2>
                    <p>Thank you for signing up. Click below to verify your email.</p>
                    <a href="https://yourcompany.com/verify-email" 
                       style="background:#007bff; color:white; padding:10px 20px; 
                              text-decoration:none; border-radius:5px;">
                        Verify Email
                    </a>
                    <p>If you didn’t sign up, you can ignore this email.</p>
                    <hr>
                    <p>&copy; 2025 YourCompany | <a href="#">Unsubscribe</a></p>
                </div>
            `
      });
      
  
      console.log(`email sent to ${email}`);
      
      // res.status(200).json({ message: ` Email sent to ${email}` });
    } catch (error) {
      console.error(" Error sending email:", error);
    
    }
};
  


module.exports = { signup, login};
