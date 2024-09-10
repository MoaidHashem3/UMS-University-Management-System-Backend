const express = module.require("express");
const mongoose = module.require("mongoose");
const dbConn = module.require("./controllers/dbConn");
const quizRoute = module.require("./routes/quizRoute");
const app = express();
app.use(express.json());
let loginRoute = module.require("./routes/loginRoute");

app.use(loginRoute);
app.use(quizRoute);

dbConn();
mongoose.connection.once("open", () => {
  console.log("Connected to db");
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
});
