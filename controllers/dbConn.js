const mongoose = require("mongoose");
require('dotenv').config();

const dbConn = async ()=>{
    try{
        mongoose.connect(process.env.CONNECTION_STRING);
    }catch(err){
        console.error(err);
    }
}

module.exports = dbConn;