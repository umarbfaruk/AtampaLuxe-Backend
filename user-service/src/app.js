// src/app.js

import express from "express";
import { verifyToken } from "./middlewares/auth.middleware.js";

const app = express();

app.use(express.json());



/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/


// Health check (PUBLIC)
app.get("/health", (req, res) => {

  res.json({
    service: "User Service",
    status: "ok",
  });

});



// Root route
// Protected - requires JWT
app.get(
  "/",
  verifyToken,
  (req, res) => {

    res.json({

      message:
        "User Service reached successfully",

      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
      },

    });

  }
);





/*
|--------------------------------------------------------------------------
| PROTECTED USER ROUTES
|--------------------------------------------------------------------------
*/


app.get(
  "/users",
  verifyToken,
  async (req, res) => {

    try {

      res.json({

        success: true,

        message:
          "Users endpoint working",

        authenticatedUser: req.user,

        data: [],

      });


    } catch(error){

      res.status(500).json({

        success:false,

        error:error.message,

      });

    }

  }
);




/*
|--------------------------------------------------------------------------
| 404
|--------------------------------------------------------------------------
*/

app.use((req,res)=>{

  res.status(404).json({

    error:"User route not found"

  });

});



export default app;