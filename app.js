const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');



const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config();

app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(expressLayouts);

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'Pharmacy' 
  }));
app.use(cookieParser('Pharmacy'));


app.use(flash());
app.use(fileUpload());

app.set('layout','./layouts/main');
app.set('view engine', 'ejs');

const routes = require('./server/routes/routesHandler.js');
app.use("/",routes);

app.listen(port, ()=>{
    console.log(`Listening to port ${port}`);
})