import { createPayment, verifyPayment } from "../opay.js";


/* =========================
   CREATE PAYMENT
========================= */

export const createPaymentController = async (
  req,
  res
)=>{

  try {

    const {
      orderId,
      amount,
      email
    } = req.body;


    if(!orderId || !amount || !email){

      return res.status(400).json({

        success:false,

        error:
        "orderId, amount and email are required"

      });

    }


    const result =
      await createPayment(
        orderId,
        amount,
        email
      );


    return res.json({

      success:true,

      data:result

    });


  }catch(err){

    console.error(
      "PAYMENT CREATE ERROR:",
      err.message
    );


    return res.status(500).json({

      success:false,

      error:err.message

    });

  }

};





/* =========================
   VERIFY PAYMENT
========================= */

export const verifyPaymentController =
async(req,res)=>{

try{


const {reference}=req.body;


if(!reference){

return res.status(400).json({

success:false,

error:"reference required"

});

}



const result =
await verifyPayment(reference);



return res.json({

success:true,

data:result

});



}catch(err){


return res.status(500).json({

success:false,

error:err.message

});


}

};