const mongoose = module.require("mongoose");
module.require('dotenv').config();

const dbConn = async ()=>{
    try{
      // mongoose.connect(process.env.CONNECTION_STRING);
       mongoose.connect('mongodb://localhost:27017/TestDB');
    }catch(err){
        console.error(err);
    }
}

module.exports = dbConn;