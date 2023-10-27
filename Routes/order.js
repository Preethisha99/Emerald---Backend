const express = require('express');
const router = express.Router();
const { newOrder, getSingleOrder, myOrders, orders, updateOrder, deleteOrder } = require('../controller/OrderController')
const { isAuthenticatedUser, authorizeRoles } = require('../Middlewares/authenTicate')


router.route('/order/new').post( isAuthenticatedUser,newOrder);
router.route('/order/:id').get( isAuthenticatedUser,getSingleOrder);
router.route('/myorders').get( isAuthenticatedUser , myOrders);

//Admin Routes : 
router.route('/getallorders').get( isAuthenticatedUser , authorizeRoles('admin') , orders )
router.route('/updateorder/:id').put( isAuthenticatedUser , authorizeRoles ('admin'), updateOrder)
router.route('/deleteorder/:id').delete(isAuthenticatedUser , authorizeRoles ('admin'), deleteOrder)


module.exports = router