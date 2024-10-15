const upload = require('../Middlewares/uploadConfig');

const { getall, getByid, updateOne,createone,deleteOne,deleteall,login,uploadImage, getAllProfessors, forgotPassword, resetPassword,verifyPassword} = module.require("../controllers/handelUser");

const express = module.require('express')
const router=express.Router();
const app = express();
const {auth,restrict}=module.require('../Middlewares/auth')
app.use(express.json())
router.get('/',auth,restrict("admin"),getall)
router.get('/professor', getAllProfessors);
router.post('/register', upload.single('image'), createone);
router.get('/:id',getByid)
router.patch('/:id', upload.single('image'), updateOne);
router.delete('/:id',deleteOne)
router.delete('/',auth,restrict("admin"),deleteall)
router.post('/login',login)
router.post('/uploadUserImage/:id',upload.single('image'),uploadImage);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/verify/:id',verifyPassword);

module.exports=router;
