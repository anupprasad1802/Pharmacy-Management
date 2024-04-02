const Razorpay = require('razorpay');
const controller = require('./Controller');


const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;

const razorpayInstance = new Razorpay({
    key_id: RAZORPAY_ID_KEY,
    key_secret: RAZORPAY_SECRET_KEY
});
let totalAmount =0;
console.log(controller.getCartItems());


exports.createOrder = async(req,res)=>{
    totalAmount = 0;
    console.log("Order Creating...");
    const quantity = req.body.quantity;
    const _items = controller.getCartItems();


    for(i=0;i< _items.length; i++){
        totalAmount += _items[i].price * quantity[i];
    }
    try {
        const amount = totalAmount*100
        const options = {
            amount: amount,
            currency: 'INR',
            receipt: 'racomzorUser@gmail.com'
        }

        razorpayInstance.orders.create(options, 
            (err, order)=>{
                if(!err){
                    res.status(200).send({
                        success:true,
                        msg:'Order Created',
                        order_id:order.id,
                        amount:amount,
                        key_id:RAZORPAY_ID_KEY,
                        name: controller.getUserInfo.name,
                        email: controller.getUserInfo.email
                    });
                }
                else{
                    res.status(400).send({success:false,msg:'Something went wrong!'});
                }
            }
        );

    } catch (error) {
        console.log(error.message);
    }
}


exports.pay= async (req, res) => {
    const quantity = req.body.quantity;
    const _items = controller.getCartItems();

    
    let totalAmount =0;

    for(i=0;i< _items.length; i++){
        totalAmount += _items[i].price * quantity[i];
    }
    console.log("Total Amount = "+totalAmount);
    console.log("\nType of " + typeof(quantity[1]) + 'Quanlity of [1] ' +quantity[1]);
    // console.log(req.body.quantity + _items);

}

exports.onSucces = async (req, res) => {
    controller.handleSuccesfulPurchase(req,res,totalAmount);
}