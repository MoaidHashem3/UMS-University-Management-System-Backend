const express = require("express");
const mongoose = require("mongoose");
const dbConn = require("./controllers/dbConn"); // Use require instead of module.require
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
const allowedOrigins = ['http://localhost:5173']; 
app.use(cors({
  origin: '*',
  methods: "*",
  credentials: true 
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

let userRoute = require("./routes/userRoute.js");
let quizRoute = require("./routes/quizRoute");
let courseRoutes = require("./routes/courseRoute");

app.use('/users', userRoute);
app.use('/quiz', quizRoute);
app.use("/courses", courseRoutes);

dbConn();
mongoose.connection.once("open", () => {
  console.log("Connected to db");
});

if (require.main === module) {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
  });
}

module.exports = app; 
