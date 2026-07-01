import express from "express";

import {
 createPaymentController,
 verifyPaymentController
}
from "../controllers/payment.controller.js";


const router = express.Router();



router.get(
 "/health",
 (req,res)=>{

 res.json({

 status:"OK",

 service:"payment-service"

 });

});




router.post(
 "/create",
 createPaymentController
);



router.post(
 "/verify",
 verifyPaymentController
);



router.post(
 "/webhook",
 (req,res)=>{

 console.log(
 "📨 OPay Webhook:",
 req.body
 );


 res.json({

 received:true

 });

});



export default router;