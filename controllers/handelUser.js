var jwt = module.require('jsonwebtoken');
const bcrypt = module.require('bcrypt');
const usermodel = module.require("../models/usersModel")


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
        let { id } = req.params;
        let newupdate = req.body;
        let updatedtuser = await usermodel.findByIdAndUpdate(id, newupdate , { new: true });
        res.json({ message: "updated", data: updatedtuser })

    } catch (e) {
        res.json({ message: "not updated", error: e.message })
    }
}
const createone = async (req, res) => {
    try {
      let newuser = req.body;
  
      if (req.file) {
        newuser.image = req.file.path;
      }
  
      let inserteduser = await usermodel.create(newuser);
      res.json({ message: "created", data: inserteduser });
    } catch (err) {
      res.json({ message: "cannot be created", error: err.message });
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
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await usermodel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Sign token with user data
        const token = jwt.sign(
            { data: {name:user.name, email: user.email, id: user._id, role: user.role, image: user.image,
                enrolledCourses: user.enrolledCourses, 
                createdCourses: user.createdCourses, 
                quizzes: user.quizzes } },
            process.env.secret,
            { expiresIn: "3h" }
        );

        // Return token and user data
        return res.status(200).json({
            message: "success",
            token,
            user: {  id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image,
                enrolledCourses: user.enrolledCourses, 
                createdCourses: user.createdCourses, 
                quizzes: user.quizzes }
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
module.exports = { getall, getByid, updateOne,createone,deleteOne,deleteall,login, uploadImage }
