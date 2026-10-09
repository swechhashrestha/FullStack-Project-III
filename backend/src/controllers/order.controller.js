const Order = require("../models/order.model");


const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      products,
      totalAmount,
    } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({
        message: "No products found in order",
      });
    }

    const order = await Order.create({
      user_id: userId,
      products,
      totalAmount: Number(totalAmount || 0),
      paymentMethod: "PENDING",
      paymentStatus: "PENDING",
    });

    return res.status(201).json({
      message: "Order created successfully",
      order,
      orderId: order._id,
    });

  } catch (error) {
    console.error(
      "Create order error:",
      error
    );

    return res.status(500).json({
      message: "Server error creating order",
    });
  }
};

const success = async (req, res) => {
  try {
    const { data } = req.query;

    if (!data) {
      return res.status(400).json({
        message: "No payment data provided",
      });
    }

    const decodedString =
      Buffer.from(data, "base64").toString("utf-8");

    const decoded = JSON.parse(decodedString);

    console.log(
      "DECODED ESEWA DATA:",
      decoded
    );

    const orderId = decoded.transaction_uuid;

    const order = await Order.findById(orderId);

    if (!order) {
      console.error(
        `Order with ID ${orderId} not found.`
      );

      return res.redirect(
        `${process.env.FRONTEND_URL}/payment-failed`
      );
    }

    const updatedOrder =
      await Order.findByIdAndUpdate(
        orderId,
        {
          paymentStatus: "COMPLETE",
          paymentMethod: "eSewa",
        },
        {
          new: true,
        }
      );

    console.log(
      "Database Order Updated Successfully:",
      updatedOrder
    );

    return res.redirect(
      `${process.env.FRONTEND_URL}/success/${orderId}`
    );

  } catch (error) {
    console.error(
      "Payment validation hook error:",
      error
    );

    return res.status(500).json({
      message: "Server parsing exception",
    });
  }
};

const confirmCOD = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const updatedOrder =
      await Order.findByIdAndUpdate(
        id,
        {
          paymentMethod: "Cash on Delivery",
          paymentStatus: "PENDING",
        },
        {
          new: true,
        }
      );

    return res.status(200).json({
      message: "Cash on Delivery order confirmed",
      order: updatedOrder,
    });

  } catch (error) {
    console.error(
      "COD confirmation error:",
      error
    );

    return res.status(500).json({
      message: "Server error confirming COD order",
    });
  }
};


const getOrder = async (req, res) => {
  try {
    const id = req.params.id;

    const order = await Order.findById(id)
      .populate(
        "user_id",
        "fullName"
      );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.status(200).json({
      message: "Order fetched successfully",
      order,
    });

  } catch (error) {
    console.error(
      "Fetch single order error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};


const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate(
        "user_id",
        "fullName email"
      );

    return res.status(200).json({
      message: "Orders fetched successfully",
      orders,
    });

  } catch (error) {
    console.error(
      "Fetch all orders error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  createOrder,
  success,
  confirmCOD,
  getOrder,
  getOrders,
};