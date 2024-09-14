const mongoose = module.require('mongoose')
const bcrypt = module.require('bcrypt');



const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trum: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trum: true,
        validate: {
            validator: function (val) {
                return /^[a-zA-Z]{3,8}@(gmail|outlook)(.com)$/.test(val)
            },
            message: () => `invaild mail or password`
        }

    },
    password: {
        type: String,
        required: true

    },
    role: {
        type: String,
        enum: ["Student", "Admin", "Instructor"],
        default: "Student"

    },
    photo: {
        type: String,
        default: "default.jpg"
    },
    // For Students, store references to enrolled courses and attempted quizzes
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    
    // For Instructors, store references to created courses and quizzes
    createdCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    
})

userSchema.pre('save', async function (next) {

    let salt = await bcrypt.genSalt(10);
    let hashpassword = await bcrypt.hash(this.password, salt);
    this.password = hashpassword

    next();
})

const User = mongoose.model('User', userSchema);
module.exports = User;