import express from "express";

import {
 createOrder,
 payOrder,
 cancelOrder,
 getOrders,
 updateOrderStatus,
 getVendorAnalytics
}
from "../controllers/order.controller.js";


import { authMiddleware }
from "../middlewares/auth.middleware.js";


import { requireRole }
from "../middlewares/role.middleware.js";


const router = express.Router();



router.post(
"/",
authMiddleware,
createOrder
);



router.get(
"/",
authMiddleware,
getOrders
);



router.patch(
"/:id/pay",
authMiddleware,
payOrder
);



router.patch(
"/:id/cancel",
authMiddleware,
cancelOrder
);



router.patch(
"/:id/status",
authMiddleware,
requireRole("ADMIN"),
updateOrderStatus
);



router.patch(
"/internal/:id/status",
updateOrderStatus
);



router.get(
"/vendor/analytics",
authMiddleware,
requireRole("VENDOR"),
getVendorAnalytics
);



export default router;