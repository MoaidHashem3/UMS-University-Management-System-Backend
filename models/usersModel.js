const mongoose = module.require("mongoose");
const bcrypt = module.require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: function (val) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val);
      },
      message: () => `invaild mail or password`,
    },
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["student", "admin", "professor"],
    default: "student",
  },
  image: {
    type: String,
  },
  // For Students, store references to enrolled courses and attempted quizzes
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],

  // For Instructors, store references to created courses and quizzes
  createdCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],

  quizzes: [
    {
      quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
      totalScore: { type: Number, default: 0 },
    },
  ],
});

userSchema.pre("save", async function (next) {
  let salt = await bcrypt.genSalt(10);
  let hashpassword = await bcrypt.hash(this.password, salt);
  this.password = hashpassword;

  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
