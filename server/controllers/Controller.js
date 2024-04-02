require('../models/database');
const { default: mongoose } = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
const Orders = require('../models/Orders');
/**
 * GET /
 * HOMEPAGE
 */
let adminUserInfo;  
let retailerUserInfo;
let customerUserInfo;
let userInfo;
let cartItem;


exports.getUserInfo = () => {
    return userInfo;
  }
exports.getCartItems = () => {
    return cartItem;
}

function isAdmin(id , callback){
    try{
        User.findOne({ _id: id,type:1}).then(result => {
            if (result) 
            {
                adminUserInfo = {
                myId: id,
                name: result.fname + " "+ result.lname,
                email: result.email,
                address: result.address,
                type: 1
                };
                userInfo = adminUserInfo;
                callback();
            }
            else{
                console.log('not found');
            }
        });
    }catch(error){
        // res.status(500).send({ message: error.message || 'Error Occuered' });
        console.log(error.message);
    }
}


function isRetailer(id , callback){
    try{
        User.findOne({ _id: id,type:2}).then(result => {
            if (result) 
            {
                retailerUserInfo = {
                myId: id,
                name: result.fname + " "+ result.lname,
                email: result.email,
                address: result.address,
                type: 2
                };
                userInfo = retailerUserInfo;
                callback();
            }
            else{
                console.log('retailer not found');
            }
        });
    }catch(error){
        // res.status(500).send({ message: error.message || 'Error Occuered' });
        console.log(error.message);
    }
}

function isUser(id , callback){
    try{
        User.findOne({ _id: id,type:0}).then(result => {
            if (result) 
            {
                customerUserInfo = {
                myId: id,
                name: result.fname + " "+ result.lname,
                email: result.email,
                address: result.address,
                type: 0
                };
                userInfo = customerUserInfo;
                callback();
            }
            else{
                console.log('retailer not found');
            }
        });
    }catch(error){
        // res.status(500).send({ message: error.message || 'Error Occuered' });
        console.log(error.message);
    }
}


exports.homepage = async (req, res) => {
    try {

        
        const limitNumber = 6;
        const latest = await Product.find({}).sort({_id:-1}).limit(limitNumber);
        const men = await Product.find({gender:'Men'}).sort({_id:-1}).limit(limitNumber);
        const women = await Product.find({gender:'Women'}).sort({_id:-1}).limit(limitNumber);
        const products = {latest,men,women};

        res.render("index", { title: 'PharmaFlow - Home' ,products,userInfo});
    }
    catch (error) {
        res.status(500).send({ message: error.message || 'Error Occuered' });
    }
}

exports.viewProduct = async (req, res) => {
    try {

        const productId = req.params.id;

        const product = await Product.findById(productId);
        res.render("view-product", { title: product.name ,product,userInfo});
    }
    catch (error) {
        res.status(500).send({ message: error.message || 'Error Occuered' });
    }
}

exports.deleteProduct = async (req, res) => {
    isAdmin(req.session.success,async function(){
        try {

            const productId = req.params.id;
    
            await Product.deleteOne({ _id: productId });
            console.log("Product Deleted With ID - "+ productId);
            res.redirect('/view-all-products');
            //res.render("view-product", { title: product.name ,product});
        }
        catch (error) {
            res.status(500).send({ message: error.message || 'Error Occuered' });
        }
    });
    isRetailer(req.session.success,async function(){
        try {

            const productId = req.params.id;
    
            await Product.deleteOne({ _id: productId });
            console.log("Product Deleted With ID - "+ productId);
            res.redirect('/retailers-view-all-products');
            //res.render("view-product", { title: product.name ,product});
        }
        catch (error) {
            res.status(500).send({ message: error.message || 'Error Occuered' });
        }
    });
    
}

exports.deleteOrder = async (req, res) => {
    isAdmin(req.session.success,async function(){
        try {
            const orderId = req.params.id;
    
            await Orders.deleteOne({ _id: orderId });
            console.log("Order Canceled With ID - "+ orderId);
            res.redirect(req.get('referer'));
        }
        catch (error) {
            res.status(500).send({ message: error.message || 'Error Occuered' });
        }
    });
}


exports.deliverOrder = async (req, res) => {
    isAdmin(req.session.success,async function(){
        try {
            const orderId = req.params.id;
    
            order = await Orders.findById(orderId);
            order.status = 'delivered';
            await order.save();
            console.log("Order Delivered With ID - "+ orderId);
            res.redirect(req.get('referer'));
        }
        catch (error) {
            res.status(500).send({ message: error.message || 'Error Occuered' });
        }
    });
}

exports.deleteUser = async (req, res) => {
    isAdmin(req.session.success,async function(){
        try {

            const userId = req.params.id;
    
            await User.deleteOne({ _id: userId });
            
            console.log("User Deleted With ID - "+ userId);
            res.redirect(req.get('referer'));
            //res.render("view-product", { title: product.name ,product});
        }
        catch (error) {
            res.status(500).send({ message: error.message || 'Error Occuered' });
        }
    });

    
}

exports.editProduct = async (req, res) => {
    isAdmin(req.session.success,async function(){
        try {

            const productId = req.params.id;
            const product = await Product.findById({ _id: productId });
            res.render('edit-product',{layout: './layouts/admin-layout',title:"Admin",userInfo: adminUserInfo,product});
            //res.render("view-product", { title: product.name ,product});
        }
        catch (error) {
            res.status(500).send({ message: error.message || 'Error Occuered' });
        }
    });
    isRetailer(req.session.success,async function(){
        try {

            const productId = req.params.id;
            const product = await Product.findById({ _id: productId });
            res.render('edit-product',{layout: './layouts/retailers-layout',title:"retailer",retailerUserInfo,product});
            //res.render("view-product", { title: product.name ,product});
        }
        catch (error) {
            res.status(500).send({ message: error.message || 'Error Occuered' });
        }
    });
    
}



exports.login = async(req,res)=>{
    try{
        res.render("login", { title: "Login"});
    }catch(error){
        res.status(500).send({ message: error.message || 'Error Occuered' });
    }
}


exports.register = async(req,res)=>{
    try{
        res.render("register", { title: "Register"});
    }catch(error){
        res.status(500).send({ message: error.message || 'Error Occuered' });
    }
}

exports.logout = (req,res)=>{
    userInfo = 'undefined';
    req.session.destroy();
    // req.session = null // Deletes the cookie
    res.redirect('/',);
}


/**
 * POST
 * REGISTER
 */


exports.handleRegister = async(req,res)=>{
    try{

        let userExits = 0;
        User.findOne({ email: req.body.email }).select("email").lean().then(result => {
            if (result) {
                
            console.log('User Exits');
            userExits = 1;
            res.redirect('/register');
            }
            else{

                if(userExits==0){
                    console.log("creating user");
                    const newUser = new User({
                        fname: req.body.fname,
                        lname: req.body.lname,
                        email: req.body.email,
                        address: req.body.address,
                        cart:[],
                        type: 0,
                        password: req.body.password
                    });
                    
                    newUser.save();
                    
                    res.redirect('/login');
                }
            }
        });
    }catch(error){
        res.status(500).send({ message: error.message || 'Error Occuered' });
    }
}

exports.handleLogin = async(req,res)=>{
    try{
        let success = '';

        User.findOne({ email: req.body.email, password: req.body.password}).select("email").lean().then(result => {
            if (result) {
                success = result._id;
                req.session.success  = success;

                isAdmin(req.session.success,function(){});
                isRetailer(req.session.success,function(){});
                isUser(req.session.success,function(){});

                res.redirect('/');
            }
            else{
                res.redirect('/login');
                console.log('User Doesnt Exits');
            }
        });
    }catch(error){
        res.status(500).send({ message: error.message || 'Error Occuered' });
    }
}

exports.admin = (req,res)=>{
    isAdmin(req.session.success,function(){
        
        res.render('admin',{layout: './layouts/admin-layout',title:"Admin",userInfo: adminUserInfo});

    });
}


exports.submitProduct = (req,res)=>{
    isAdmin(req.session.success,function(){
        res.render('submit-product',{layout: './layouts/admin-layout',title:"Admin",userInfo: adminUserInfo});
    });
}


exports.addProduct = async(req,res)=>{
    try{

        let imageUploadFile;
        let uploadPath;
        let newImageName;

        if(!req.files || Object.keys(req.files).length === 0){
            console.log("No Files where Uploaded.");
        }else{
            imageUploadFile = req.files.image;
            newImageName = Date.now()+imageUploadFile.name;

            uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

            imageUploadFile.mv(uploadPath, function(err){
                if(err) console.log(err);
            })
        }

        const newProduct = new Product({
            name: req.body.name,
            brand: req.body.brand,
            description: req.body.description,
            tags: req.body.tags,
            image: newImageName,
            price: req.body.price,
            state: req.body.state,
            city: req.body.city,
            productType: "normal",
            submitter: adminUserInfo.myId
        });


        await newProduct.save();
        console.log("SUbmiited");
        // req.flash('infoSubmit','Recipe has been Added');
        res.redirect("/submit-product");

    }catch(error)
    {
        // req.flash('infoError',error.message);
        console.log(error);
        res.redirect("/submit-product");
    }
}

exports.updateProduct = async(req,res)=>{
    try{

        let imageUploadFile;
        let uploadPath;
        let newImageName;
        let result;
        result = await Product.findOne({_id:req.body.id});
        if(!req.files || Object.keys(req.files).length === 0){
            newImageName = result.image;
            console.log("No Files where Uploaded. Uploading Last - "+uploadPath);
        }else{
            imageUploadFile = req.files.image;
            newImageName = Date.now()+imageUploadFile.name;

            uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

            imageUploadFile.mv(uploadPath, function(err){
                if(err) console.log(err);
            })
        }

        const newProduct = new Product({
            name: req.body.name,
            brand: req.body.brand,
            description: req.body.description,
            gender: req.body.gender,
            tags: req.body.tags,
            image: newImageName,
            price: req.body.price,
            state: req.body.state,
            city: req.body.city,
        });

         await Product.updateOne({_id:req.body.id}, {
            name:newProduct.name,
            brand:newProduct.brand,
            description: newProduct.description,
            tags: newProduct.tags,
            image: newProduct.image,
            price: newProduct.price,
            state: newProduct.state,
            city: newProduct.city
        });
       // result = newProduct;
        //result.save();
        // req.flash('infoSubmit','Recipe has been Added');
        res.redirect('back');

    }catch(error)
    {
        // req.flash('infoError',error.message);
        console.log(error);
        res.redirect('back');
    }
}


exports.viewAllProduct = async(req,res)=>{
    isAdmin(req.session.success,async function(){

        const product = await Product.find({}).sort({_id:-1});

        res.render('view-all-products',{layout: './layouts/admin-layout',title:"Admin",userInfo: adminUserInfo,product});
    });
}

exports.viewAllUsers = async(req,res)=>{
    isAdmin(req.session.success,async function(){
        const allUsers = await User.find({type:req.params.id});
        res.render('users',{layout: './layouts/admin-layout',title:"Admin",userInfo: adminUserInfo,allUsers:allUsers});
    });
}

exports.viewOrders = async(req,res)=>{
    isAdmin(req.session.success,async function(){

        const orders = await Orders.find({}).sort({_id:-1});

        res.render('order',{layout: './layouts/admin-layout',title:"Order",userInfo: adminUserInfo,orders});
    });
    isRetailer(req.session.success,async function(){

        const orders = await Orders.find({});

        res.render('order',{layout: './layouts/retailers-layout',title:"Order",userInfo: retailerUserInfo,orders});
    });
}


exports.searchProduct = async(req,res)=>{

    try{
        let searchTerm = req.body.searchTerm;
        let isFast = req.body.fast;

        if(typeof isFast!='undefined'){
            let searchCity = req.body.city;
            console.log("Fast Search - "+ searchCity);
            let result = await Product.find({ $text: {$search: searchTerm, $diacriticSensitive: true}, productType:"flash" , city:searchCity});
            res.render("search", { title: 'Search',result,userInfo,searchTerm,fast:'checked'});
        }
        else{
            
            console.log("normal Search");
            let result = await Product.find({ $text: {$search: searchTerm, $diacriticSensitive: true} },);
            res.render("search", { title: 'Search',result,userInfo,searchTerm});
        }
        
    }
    catch(error){
        res.status(500).send({message: error.message || 'Error Occuered'});
    }
}


exports.exploreLatest = async(req,res)=>{
    result = await Product.find({}).sort({_id:-1});
    res.render("explore-latest", { title: 'Latest',result,userInfo});

} 

//TODO Check if user is retailer
// Retailer
exports.retailer = async(req,res)=>{
    isRetailer(req.session.success,async function(){

        res.render('retailer-dashboard',{layout: './layouts/retailers-layout',title:"Retailer's Admin",retailerUserInfo,userInfo});
    })
}


exports.retailerSubmit = async(req,res) =>{
    isRetailer(req.session.success,async function(){
        res.render('retailers-submit',{layout: './layouts/retailers-layout',title:"Retailer's Admin",retailerUserInfo});
    })
}

exports.addProductRetailer = async(req,res)=>{
    try{

        let imageUploadFile;
        let uploadPath;
        let newImageName;

        if(!req.files || Object.keys(req.files).length === 0){
            console.log("No Files where Uploaded.");
        }else{
            imageUploadFile = req.files.image;
            newImageName = Date.now()+imageUploadFile.name;

            uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

            imageUploadFile.mv(uploadPath, function(err){
                if(err) console.log(err);
            })
        }

        const newProduct = new Product({
            name: req.body.name,
            brand: req.body.brand,
            description: req.body.description,
            tags: req.body.tags,
            image: newImageName,
            price: req.body.price,
            state: req.body.state,
            city: req.body.city,
            productType: "flash",
            submitter: retailerUserInfo.myId
        });


        await newProduct.save();
        console.log("SUbmiited");
        // req.flash('infoSubmit','Recipe has been Added');
        res.redirect("/retailers-submit");

    }catch(error)
    {
        // req.flash('infoError',error.message);
        console.log(error);
        res.redirect("/retailers-submit");
    }
}
exports.viewAllProductRetailer = async(req,res)=>{
    isRetailer(req.session.success,async function(){
        const product = await Product.find({submitter: retailerUserInfo.myId}).sort({_id:-1}).exec();

        res.render('view-all-products',{layout: './layouts/retailers-layout',title:"Retailer",retailerUserInfo,product});
    });
}

exports.cart = async(req,res)=>{
    const user = await User.findById(userInfo.myId);
    const itemArr = user.cart;

    cartItem = await Product.find({'_id': { $in: itemArr}});

    res.render("cart", { title: 'PharmaFlow - Cart' ,userInfo,cartItem});
}

exports.addToCart = async(req,res)=>{
    try{
        const user = await User.findById(userInfo.myId);
        
        user.cart.push(req.body.productId);

        user.save();
        res.redirect(req.get('referer'));


    }catch(err){
        res.redirect("back");
    }
}


exports.deleteItem = async(req,res)=>{
    try {
        const productId = req.params.id;

        await User.updateMany({_id:userInfo.myId},{$pull:{cart:productId}});

        res.redirect(req.get('referer'));
        //res.render("view-product", { title: product.name ,product});
    }
    catch (error) {
        res.status(500).send({ message: error.message || 'Error Occuered' });
    }
}

exports.handleSuccesfulPurchase = async(req,res,total)=>{

    try{

       let allItems=[];


        cartItem.forEach(element => {
           allItems.push({
            name:element,
            id:element.id
           })
        });

        console.log("allItems - "+ allItems);

        const newOrder = new Orders({
            items: allItems,
            buyerName: userInfo.name,
            address: userInfo.address,
            totalPrice: total,
            status: 'out'
        });

        await newOrder.save();

        await User.updateOne({_id:userInfo.myId},{cart:[]});

        res.redirect('/thank-you');
        
    }catch(error){
        res.status(500).send({ message: error.message || 'Error Occuered' });
    }
}

exports.thankyou = (req,res)=>{
    res.render("thankyou", { title: "Order Success" ,userInfo});
}

exports.sales = async(req,res)=>{

    try{
        isAdmin(req.session.success,async function(){
            const orders = await Orders.find({}).sort({_id:-1});

            let total=0;

            orders.forEach(element => {
            total += element.totalPrice;
            });

            total = Math.round(total);
            res.render('sales',{layout: './layouts/admin-layout',title:"Sales",userInfo: adminUserInfo,orders,total});
        });
        isRetailer(req.session.success,async function(){
            const orders = await Orders.find({"items.0.name.submitter":userInfo.myId}).sort({_id:-1});
            console.log(orders);
            let total=0;

            orders.forEach(element => {
            total += element.totalPrice;
            });

            res.render('sales',{layout: './layouts/retailers-layout',title:"Sales",retailerUserInfo,orders,total});
        });
        
    }catch(error){
        res.status(500).send({ message: error.message || 'Error Occuered' });
    }
    
}