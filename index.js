const express = module.require("express")
const mongoose = module.require("mongoose");
const dbConn = module.require('./controllers/dbConn')
const app = express()
app.use(express.json())
let usersRoutes=module.require('./routes/users')
app.use("/users",usersRoutes)
dbConn();
mongoose.connection.once('open', ()=>{
    console.log("Connected to db")
    app.listen(3000,()=>{
        console.log("Server is running on port 3000")
    })
})
