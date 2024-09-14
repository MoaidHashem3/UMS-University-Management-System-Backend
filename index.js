const express = module.require("express");
const mongoose = module.require("mongoose");
const dbConn = module.require("./controllers/dbConn");
const app = express();
app.use(express.json());
let userRoute = module.require("./routes/userRoute.js");
let quizRoute = module.require("./routes/quizRoute");
let courseRoutes = module.require("./routes/courseRoute");

app.use('/users',userRoute);
app.use('quiz',quizRoute);
app.use("/courses", courseRoutes);

dbConn();
mongoose.connection.once("open", () => {
  console.log("Connected to db");
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
});
