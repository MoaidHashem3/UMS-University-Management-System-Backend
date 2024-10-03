var jwt = module.require('jsonwebtoken');
const bcrypt = module.require('bcrypt');
const usermodel = module.require("../models/usersModel")


const getall = async (req, res) => {
    try {
        let users = await usermodel.find().populate("quiz")
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
    let { email, password } = req.body;
    if (!email || !password) {
        return res.json({ message: "required" })
    }
    let user = await usermodel.findOne({ email: email })
    if (!user) {
        return res.json({ message: "invalid email or password" })
    }
    let isvalid = await bcrypt.compare(password, user.password)
    if (!isvalid) {
        return res.json({ message: "invalid email or password " })

    }
    let token = jwt.sign({ data: { email: user.email, id: user._id, role: user.role } }, process.env.secret, { expiresIn: "3h" })
    return res.json({ message: "success", token: token })
}
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
