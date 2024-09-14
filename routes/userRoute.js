const { getall, getByid, updateOne,createone,deleteOne,deleteall,login} = module.require("../controllers/handelUser");

const express = module.require('express')
const router=express.Router();
const app = express();
const {auth,restrict}=module.require('../Middlewares/auth')
app.use(express.json())
router.get('/',auth,restrict("Admin"),getall)
router.post('/',createone)
router.get('/:id',getByid)
router.patch('/:id',updateOne)
router.delete('/:id',deleteOne)
router.delete('/',auth,restrict("Admin"),deleteall)
router.post('/login',login)
module.exports=router;
