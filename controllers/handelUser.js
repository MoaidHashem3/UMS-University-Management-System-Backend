var jwt = module.require('jsonwebtoken');
const bcrypt = module.require('bcrypt');
const usermodel = module.require("../models/usersModel")
const crypto = require('crypto');
const nodemailer = require('nodemailer');


const getall = async (req, res) => {
    try {
        let users = await usermodel.find().populate("quizzes")
        const count = await usermodel.countDocuments({});
        res.json({ message: "all users", data: users, totaldocs: count })
    } catch (e) {
        res.json({ message: e.message })

    }
}



const getByid = async (req, res) => {
    try {
        let { id } = req.params;
        let user = await usermodel.findById(id);
        if (user) {
            res.status(200).json({ data: user })

        } else {
            res.status(400).json({ message: 'can not be fouund' })
        }

    } catch (e) {
        res.status(500).json({ message: e.message })
    }

}
const updateOne = async (req, res) => {
    try {
      const { id } = req.params;
      const { password, ...newUpdate } = req.body; // Extract other fields from req.body
      const updateData = { ...newUpdate };
  
      // Handle password hashing if provided
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateData.password = hashedPassword;
      }
  
      // If an image is provided, handle file upload
      if (req.file) {
        updateData.image = req.file.path; // Set image path from multer file upload
      }
  
      // Find the user and update
      const updatedUser = await usermodel.findByIdAndUpdate(id, updateData, { new: true });
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ message: "Profile updated", data: updatedUser });
    } catch (error) {
      res.status(500).json({ message: "Error updating profile", error: error.message });
    }
  };


const createone = async (req, res) => {
    try {
        // Extract user data from the request body
        let newuser = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role
        };

        // Check if a file was uploaded and set the image path if it exists
        if (req.file) {
            newuser.image = req.file.path;
        }

        // Insert the new user into the database
        let inserteduser = await usermodel.create(newuser);
        res.json({ message: "User created successfully", data: inserteduser });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(400).json({ message: "User cannot be created", error: err.message });
    }
};


const deleteOne =async (req, res) => {
    try {
        let { id } = req.params;

        let user = usermodel.findById(id);
        await user.deleteOne();

        res.json({ message: "deleted" })
    } catch (e) {
        res.json({ message: e.message })
    }

}
const deleteall = async (req, res) => {
    try {
        await usermodel.deleteMany({});
        res.json({ message: "all users are deleted" })
    } catch (e) {
        res.json({ message: e.message })
    }

}
const getAllProfessors = async (req,res) => {
    try {
        const professors = await usermodel.find({ role: "professor" }).select("name email createdCourses");
        if (professors) {
            res.status(200).json({ message: "all professors", data: professors });

        } else {
            res.status(404).json({ message: 'can not be fouund' })
        }

      } catch (e) {
        res.json({ message: e.message })
      }
  };

  const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await usermodel.findOne({ email }).populate('createdCourses', 'title');
     
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const imageUrl = `${req.protocol}://${req.get('host')}/${user.image}`;

        const token = jwt.sign(
            {
                data: {
                    name: user.name,
                    email: user.email,
                    id: user._id,
                    role: user.role,
                    image: imageUrl,
                    enrolledCourses: user.enrolledCourses,
                    createdCourses: user.createdCourses, 
                    quizzes: user.quizzes
                }
            },
            process.env.secret,
            { expiresIn: "3h" }
        );

        // Return token and user data
        return res.status(200).json({
            message: "success",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: imageUrl,
                enrolledCourses: user.enrolledCourses,
                createdCourses: user.createdCourses, 
                quizzes: user.quizzes
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error, please try again later" });
    }
};



const uploadImage = async (req, res) => {
    
    try {
      const user = await usermodel.findById(req.params.id);
      if (!user) return res.status(404).send('User not found');

      user.image = req.file.path; 
      await user.save();
  
      res.send('Image uploaded and updated for user');
    } catch (err) {
        console.log(err)
      res.status(500).send(err.message);
    }
  };

  const forgotPassword = async (req, res) => {
    const { email } = req.body;
    console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS);

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const user = await usermodel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const token = crypto.randomBytes(20).toString('hex');

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const transporter = nodemailer.createTransport({
            host: 'in.mailjet.com',
  port: 587,
  auth: {
    user: process.env.MAILJET_API_KEY,
    pass: process.env.MAILJET_API_SECRET, 
  },
        });

        const resetUrl = `http://localhost:5173/reset-password/${token}`;
        const mailOptions = {
            to: user.email,
            from: 'gamestorrent2015@gmail.com',
            subject: 'UMS Password Reset',
            text: `You are receiving this because you have requested to reset the password for your account.\n\n
                Please click on the following link, or paste it into your browser to complete the process:\n\n
                ${resetUrl}\n\n
                If you did not request this, please ignore this email and your password will remain unchanged.\n
                UMS TEAM`,
        };

        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                return res.status(500).json({ message: "Error sending email", error: err.message });
            }
            res.status(200).json({ message: "Password reset link sent!" });
        });

    } catch (error) {
        res.status(500).json({ message: "Server error, please try again later" });
    }

};
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    console.log(password)
    if (!password) {
        return res.status(400).json({ message: "Password is required" });
    }

    try {
        const user = await usermodel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }, 
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

    
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ message: "Password successfully reset!" });
    } catch (error) {
        res.status(500).json({ message: "Server error, please try again later" });
    }
};

module.exports = { getall, getByid, updateOne,createone,deleteOne,deleteall,login, uploadImage,getAllProfessors, forgotPassword, resetPassword }
