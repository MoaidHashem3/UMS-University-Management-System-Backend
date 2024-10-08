const express = module.require("express");
const mongoose = module.require("mongoose");
const dbConn = module.require("./controllers/dbConn");
const path = require('path');

const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));




let userRoute = module.require("./routes/userRoute.js");
let quizRoute = module.require("./routes/quizRoute");
let courseRoutes = module.require("./routes/courseRoute");


app.use('/users',userRoute);
app.use('/quiz',quizRoute);
app.use("/courses", courseRoutes);

dbConn();
mongoose.connection.once("open", () => {
  console.log("Connected to db");
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});
