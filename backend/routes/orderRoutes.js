import express from "express";
import { createOrder, getMyOrders, getOrderById, getAllOrders, markOrderAsDelivered, markOrderAsPaid , updateOrderToPaid } from "../controllers/orderController.js";
import {adminOnly, protect} from "../middleware/authMiddleware.js"

const router=express.Router()

router.post("/",protect,createOrder);
router.get("/myorders",protect,getMyOrders);
router.get("/:id",protect,getOrderById);
router.get("/",protect,adminOnly,getAllOrders);
router.put("/:id/deliver", protect, adminOnly, markOrderAsDelivered);
router.put("/admin/:id/pay", protect, adminOnly, markOrderAsPaid);
router.put('/:id/pay', protect, updateOrderToPaid);



export default router;