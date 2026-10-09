const express = require("express");

const {
  verifyToken,
  isAdmin,
} = require("../middlewares/auth.middleware");

const {
  createOrder,
  success,
  confirmCOD,
  getOrder,
  getOrders,
} = require("../controllers/order.controller");

const router = express.Router();

router.post(
  "/create",
  verifyToken,
  createOrder
);

router.get(
  "/success",
  success
);

router.put(
  "/:id/cod",
  verifyToken,
  confirmCOD
);


router.get(
  "/",
  verifyToken,
  isAdmin,
  getOrders
);

router.get(
  "/:id",
  verifyToken,
  getOrder
);

module.exports = router;