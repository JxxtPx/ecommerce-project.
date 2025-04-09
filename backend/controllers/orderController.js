import Order from "../models/Order.js";

const createOrder = async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: "No order items" });
  }
  try {
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const order = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const proId = req.params.id;
    const order = await Order.findById(proId).populate("user", "name email");
    if (!order) {
      res.status(404).json({ message: "Product not found" });
    }
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this order" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const Orders = await Order.find({}).populate("user", "name email");
    res.json(Orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delivery routes
const markOrderAsDelivered =async(req,res)=>{
  try{
    const orderId =req.params.id
    const order=await Order.findById(orderId);
    if(order){
      order.isDelivered=true,
      order.deliveredAt=Date.now();
      const updatedOrder=await order.save();
      res.json(updatedOrder)
    }else{
      res.status(404).json({message:"No order found"})
    }


  }catch(error){
    res.status(500).json({message:error.message})

  }
}
const markOrderAsPaid = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);

    if (order) {
      order.isPaid = true;
      order.paidAt = new Date(); // ✅ Set timestamp
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "No order found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Update order to paid error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { createOrder, getMyOrders, getOrderById, getAllOrders , markOrderAsDelivered, markOrderAsPaid, updateOrderToPaid};
