const upload = require("../Middlewares/uploadConfig");

const {
  getall,
  getByid,
  updateOne,
  createone,
  deleteOne,
  deleteall,
  login,
  uploadImage,
} = module.require("../controllers/handelUser");

const express = module.require("express");
const router = express.Router();
const app = express();
const { auth, restrict } = module.require("../Middlewares/auth");
app.use(express.json());
router.get("/", auth, restrict("admin"), getall);
router.post("/register", upload.single("image"), createone);
router.get("/:id", getByid);
router.patch("/:id", updateOne);
router.delete("/:id", deleteOne);
router.delete("/", auth, restrict("admin"), deleteall);
router.post("/login", login);
router.post("/uploadUserImage/:id", upload.single("image"), uploadImage);
module.exports = router;
