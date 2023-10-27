const mongoose = require('mongoose')

const orderSchema =mongoose.Schema( {
    shippingInfo:{
        address:{
            type: "String",
            required: true
        },
        country:{
            type: "String",
            required: true
        },
        city:{
            type: "String",
            required: true
        },
        PhoneNo:{
            type: Number,
            required: true
        },
        postalCode: {
            type:"String",
            required: true
        }

    },
    user:{
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "User" //user collection ah refer pannuthu 
    },
    orderItems: [{
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        product: {
            type: mongoose.SchemaTypes.ObjectId,
            required: true,
            ref: 'Products'
        }

    }],
    itemsPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    paymentInfo: {
        id: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true
        }
    },
    paidAt: {
        type: Date
    },
    deliveredAt: {
        type: Date
    },
    orderStatus: {
        type: String,
        required: true,
        default: 'Processing'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
    
})

// model uruvakkurom 
let orderModel = mongoose.model('Order', orderSchema);
module.exports =orderModel 