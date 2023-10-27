const express = require('express');
const { getProducts, newProduct , getSingleProduct, updateProduct , deleteProduct, createReview, getReview, DeleteReview} = require('../controller/productController');
const router = express.Router();
const {isAuthenticatedUser, authorizeRoles} = require('../Middlewares/authenTicate')

router.route('/products').get( getProducts)
router.route('/product/:id').get(getSingleProduct);
router.route('/product/:id').put(updateProduct);
router.route('/product/:id').delete(deleteProduct);
router.route('/review').put(isAuthenticatedUser , createReview);
router.route('/getreview').get(getReview)
router.route('/deletereview').delete(DeleteReview)

//ADMIN ROUTES
//user oda data access pannurathuku -(isAuthenticatedUser)
router.route('/admin/product/new').post( isAuthenticatedUser ,authorizeRoles('admin'), newProduct);


module.exports = router