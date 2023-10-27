const  Products = require( '../data/Products.json')
const  ProductModel = require('../models/productModel')
const dotenv = require( 'dotenv')
const ConnectDatabase = require( '../Config/database')

const seedProduct = async()=>{

    // dotenv file access 
    dotenv.config({path:'Backend/Config/config.env'})
    // DB calling
    ConnectDatabase();
   
    try{  //server la demo data poda use ahgum feature
       await ProductModel.deleteMany();
        console.log("Products Deleted")
       await ProductModel.insertMany(Products);
        console.log("All products added")
    }
    catch(error){
        console.log(error.message);
    } process.exit();
}
   

seedProduct();
