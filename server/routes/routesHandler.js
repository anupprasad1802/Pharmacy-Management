const express = require('express');
const router = express.Router();
const controller = require('../controllers/Controller');
const paypal = require('../controllers/PaypalController');
const razorPay = require('../controllers/RazorPayController');
/**
 * APP Routes
 */
router.get('/',controller.homepage);
router.get('/login',controller.login);
router.get('/register',controller.register);
router.get('/view-product/:id',controller.viewProduct);
router.get('/logout',controller.logout);

router.get('/admin',controller.admin);
router.get('/submit-product',controller.submitProduct);
router.get('/sales',controller.sales);
router.get('/view-all-products',controller.viewAllProduct);
router.get('/delete/:id',controller.deleteProduct);
router.get('/deleteOrder/:id',controller.deleteOrder);
router.get('/delivered/:id',controller.deliverOrder);
router.get('/edit-product/:id',controller.editProduct);
router.get('/users/:id',controller.viewAllUsers);
router.get('/orders',controller.viewOrders);
router.get('/deleteUsers/:id',controller.deleteUser);
router.get('/delete-item/:id',controller.deleteItem);
router.get('/retailer',controller.retailer);
router.get('/retailers-submit',controller.retailerSubmit);
router.get('/retailers-view-all-products',controller.viewAllProductRetailer);
router.get('/cart',controller.cart);


router.post('/pay',razorPay.createOrder);
// router.post('/address',controller.AddOrderUserInfo);
router.get('/success',razorPay.onSucces);
router.get('/cancel',paypal.cancel);
router.get('/thank-you',controller.thankyou);
router.get('/explore-latest',controller.exploreLatest);


router.post('/register',controller.handleRegister);
router.post('/login',controller.handleLogin);
router.post('/submit-product',controller.addProduct);
router.post('/submit-product-retailer',controller.addProductRetailer);
router.post('/update-product',controller.updateProduct);
router.post('/search',controller.searchProduct);
router.post('/add-to-cart',controller.addToCart);


module.exports= router;