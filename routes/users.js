const {login} =module.require('../controllers/users.js')
const express = module.require('express')
const router=express.Router();
const app = express();
app.use(express.json())
router.post('/login',login)
module.exports=router;
