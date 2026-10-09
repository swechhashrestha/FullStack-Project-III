const express = require("express");
const { createProduct, fetchProducts, deleteProduct, getProduct, editProduct } = require("../controllers/product.controller");
const {verifyToken, isAdmin} = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");
const router = express.Router();

router.post("/", verifyToken, isAdmin, upload.single("image"), createProduct);
router.get("/",fetchProducts);
router.get("/:id", getProduct);
router.patch("/:id",verifyToken, isAdmin, upload.single("image"), editProduct);
router.delete("/:id", verifyToken, isAdmin, deleteProduct);

module.exports = router;