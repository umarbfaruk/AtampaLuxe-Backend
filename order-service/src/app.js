import express from "express";
import orderRoutes from "./routes/order.routes.js";

const app = express();


/* =========================
   MIDDLEWARE
========================= */

app.use(express.json());


/* =========================
   HEALTH CHECK
========================= */

app.get("/health", (req, res) => {

  res.status(200).json({
    service: "Order Service",
    status: "healthy",
    timestamp: new Date().toISOString()
  });

});



/* =========================
   SERVICE INFO
========================= */

app.get("/service-info", (req,res)=>{

  res.status(200).json({
    service:"Order Service",
    port:3004,
    status:"running"
  });

});



/* =========================
   ORDER ROUTES
=========================

Supports:

Direct:
POST http://localhost:3004/orders

Gateway:
POST http://localhost:3000/api/orders


========================= */


/*
 IMPORTANT:
 Mount on BOTH paths

 because gateway rewrite can produce:

 /
 /orders

*/

app.use("/", orderRoutes);

app.use("/orders", orderRoutes);




/* =========================
   ROOT DEBUG
========================= */

app.get("/", (req,res)=>{

 res.json({

   service:"Order Service",

   message:"Order service root",

   routes:[
    "POST /orders",
    "GET /orders",
    "PATCH /orders/:id/pay",
    "PATCH /orders/:id/cancel"
   ]

 });

});




/* =========================
   404 HANDLER
========================= */

app.use((req,res)=>{


 console.log(
   "ORDER 404:",
   req.method,
   req.originalUrl
 );


 res.status(404).json({

   success:false,

   error:"Order Service route not found",

   path:req.originalUrl

 });


});




/* =========================
   ERROR HANDLER
========================= */

app.use((err,req,res,next)=>{


 console.error(
   "ORDER SERVICE ERROR:",
   err
 );


 res.status(500).json({

   success:false,

   error:err.message

 });


});



export default app;