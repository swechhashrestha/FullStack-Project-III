const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  getAllUsers,
  deleteUser,
  getUserById,
  editUser,
} = require("../controllers/user.controller");
const {verifyToken, isAdmin} = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.get("/", verifyToken, getUser);
router.get("/all",verifyToken, isAdmin, getAllUsers);

router.delete("/:id", verifyToken, isAdmin, deleteUser);
router.get("/:id", getUserById);

router.patch("/:id", verifyToken, isAdmin, editUser);
module.exports = router;