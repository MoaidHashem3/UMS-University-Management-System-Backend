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
      const { newPassword, ...newUpdate } = req.body; // Extract other fields from req.body
      const updateData = { ...newUpdate };
    console.log(req.body)
      // Handle password hashing if provided
      if (newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        updateData.password = hashedPassword;
      }
  
      if (req.file) {
        updateData.image = req.file.path; // Set image path from multer file upload
      }
  
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
            html: `
            <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 8px;">
                <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                 <h1 style="color:#808080;">UMS</h1>
                <h2 style="color: #333333;">Password Reset Request [Valid for 1 hour]</h2>
                    <p style="color: #555555;">Dear ${user.name},</p>
                    <p style="color: #555555;">
                        You are receiving this email because we received a request to reset the password for your account.
                    </p>
                    <p style="color: #555555;">
                        To complete the process, please click on the link below or copy and paste it into your browser:
                    </p>
                    <p>
                        <a href="${resetUrl}" style="color: #008A90; text-decoration: none; font-weight: bold;">${resetUrl}</a>
                    </p>
                    <p style="color: #555555;">
                        If you did not request this change, please ignore this email. Your password will remain unchanged.
                    </p>
                    <p style="color: #555555;">Thank you,</p>
                    <p style="color: #008A90; font-weight: bold;">UMS Team</p>
                </div>
            </div>
        `
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
  const verifyPassword = async (req, res) => {
    const { password } = req.body;
    console.log("password is",password)
    try {
      const user = await usermodel.findById(req.params.id);
      if (!user) return res.status(404).send('User not found');

        const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) return res.status(401).send('passord is not valid');

      res.send( isValid);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  const getUserQuizzes = async(req, res) => {
    try {
        const userId = req.params.id;

        const user = await usermodel.findById(userId).populate({
            path: 'quizzes.quizId',         
            select: 'title course questions', 
            populate: {                     
                path: 'course',
                select: 'title'             
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const quizzes = user.quizzes.map(q => ({
            quizTitle: q.quizId.title,                  
            courseTitle: q.quizId.course?.title || '',  
            score: q.totalScore ,
            total:q.quizId.questions.length                    
        }));

        return res.json({ quizzes });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }

};

module.exports = { getall, getByid, updateOne,createone,deleteOne,deleteall,login, uploadImage,getAllProfessors, forgotPassword, resetPassword,verifyPassword,getUserQuizzes }
