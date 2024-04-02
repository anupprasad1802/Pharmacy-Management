const paypal = require("paypal-rest-sdk");
const controller = require('./Controller');

paypal.configure({
    mode: "sandbox", //sandbox or live
    client_id:
      "AXEMWpPQ7mRPid0Cek39fE1_QvcMWc2LQpZ_XM6isaRp_yYHxcLocMOFki7SVgWXaw-f2yS4ht9VMfIr",
    client_secret:
      "EKLyguicx78jtmo_cExwTO6Wht9ikrK594-6wtfjaw2nilOGrqrX1J6F2LzUAwnE8PPXp6-5Mg43XkJH",
  });

  let total =0;


exports.pay = async (req, res) => {

  console.log(req.body.quantity);

    total = 0;
    const _items = controller.getCartItems();
    
    let allItems=[];

    
    _items.forEach(function(element,index){
        allItems.push({
            name: element.name,
            sku:"001",
            price:element.price,
            currency: "USD",
            quantity:req.body.quantity[index]
        });
        total+=element.price*req.body.quantity[index];
    })

    console.log("Toatl-"+total);
    jsonData =  JSON.stringify(allItems);
    

    const create_payment_json = {
        intent: "sale",
        payer: {
          payment_method: "paypal",
        },
        redirect_urls: {
          return_url: "http://localhost:3000/success",
          cancel_url: "http://localhost:3000/cancel",
        },
        transactions: [
          {
            jsonData,
            amount: {
              currency: "INR",
              total: total,
            },
            description: "Best Way to buy clothes",
          },
        ],
      };
    
      paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
          throw error;
        } else {
          for (let i = 0; i < payment.links.length; i++) {
            if (payment.links[i].rel === "approval_url") {
              res.redirect(payment.links[i].href);
            }
          }
        }
      });
}

exports.succes= async (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "INR",
          total: total,
        },
      },
    ],
  };

paypal.payment.execute(
    paymentId,
    execute_payment_json,
    function (error, payment) {
      if (error) {
        console.log(error.response);
        throw error;
      } else {
        controller.handleSuccesfulPurchase(req,res,payment,total);
      }
    }
  );
}

exports.cancel= async (req, res) => {
    res.send('Cancelled');
}
