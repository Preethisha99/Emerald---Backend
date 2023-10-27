const catchAsyncError = require('../Middlewares/catchAsyncError')
const Order = require('../models/OrderModel')
const ErrorHandler = require('../utils/errorHandler')
const Product = require('../models/productModel')


//Create New Order --> api/v1/order/new
exports.newOrder =catchAsyncError( async(req,res,next)=>{
    const {
        shippingInfo,
        orderItems,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body //req.body engura object la erunthu kedaikum

    const order = await Order.create({
        shippingInfo,
        orderItems,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt : Date.now(),
        user: req.user.id
    })

    res.status(200).json({
        success: true,
        order
    })
})
//Get Single Order --> api/v1/order/:id
exports.getSingleOrder= catchAsyncError(async(req,res,next)=>{
                                                    //Populate method: >>user oda id ya match panni athula erukura name & email ah eduthutu varum
    const order = await Order.findById(req.params.id).populate('user', 'name email')
    if(!order){
        return next(new ErrorHandler(`Order not found with this id: ${req.params.id}` , 404))
    }
    res.status(200).json({
        success : true,
        order
    })
})
//Get Loggedin User Orders --> api/v1/myorders
exports.myOrders = catchAsyncError(async(req,res,next)=>{
                                    //particular user oda id ya edukkurathuku 
   const orders = await Order.find({user: req.user.id});

   res.status(200).json({
    success: true,
    orders
   })
})
//Admin: Get All Orders - api/v1/orders
exports.orders =catchAsyncError(async (req,res,next)=>{
    const orders = await Order.find();
    let totalAmount = 0;
    // orders la ulla data va , ovoru datavaum foreach mullam ah kondu varom
    orders.forEach(order =>{
        totalAmount += order.totalPrice
    })

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
})
// Update Order or Order Status --> Update Order Status , delivery Date , Product Quantity , Product Stack ---->api/v1/order/:id
exports.updateOrder = catchAsyncError(async(req,res,next)=>{
     const order = await Order.findById(req.params.id);

     if(order.orderStatus == "Delivered"){
        return next(new ErrorHandler(`Order has been already delivered!`,400))
     }
     //Updating the product stock of each order item
     order.orderItems.forEach( async orderItems => {
       await updateStock (orderItems.product , orderItems.quantity)
     })
     //here we update the orderStatus
     order.orderStatus = req.body.orderStatus;
     order.deliveredAt = Date.now();
     await order.save();
     res.status(200).json({
        success: true
     })
})

async function updateStock (productId , quantity){
    const product = await Product.findById(productId);
    product.stock = product.stock - quantity;
    product.save({validateBeforeSave : false})
}
//Admin : Delete Order - api/v1/deleteorder/:id
exports.deleteOrder = catchAsyncError( async(req,res,next)=>{
    const order = await Order.findById(req.params.id)
    if(!order){
        return next(new ErrorHandler(`Order not found with this id ${req.params.id}`))
    }
    await order.deleteOne();
    
    res.status(200).json({
        success: true
    })
})