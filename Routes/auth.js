const express = require('express');
const { registerUser, 
     loginUser,
     logoutUser,
     forgotPassword, 
     resetPassword,
     getUserProfile, 
     ChangePassword,
     updateProfile,
     getAllUsers,
     getUser,
     updateUser,
     deleteUser} = require('../controller/authController');
const router=  express.Router();
const {isAuthenticatedUser, authorizeRoles} = require('../Middlewares/authenTicate')

router.route('/auth/register').post(registerUser);
router.route('/auth/login').post(loginUser)
router.route('/auth/logout').get(logoutUser)
router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset/:token').post(resetPassword)
router.route('/auth/myprofile').get(isAuthenticatedUser, getUserProfile)
router.route('/auth/password/change').put(isAuthenticatedUser, ChangePassword)
router.route('/auth/update').put(isAuthenticatedUser, updateProfile)


//Admin Routes
router.route('/admin/users').get(isAuthenticatedUser, authorizeRoles('admin'),getAllUsers)
router.route('/admin/getuser/:id').get(isAuthenticatedUser, authorizeRoles('admin'), getUser )
router.route('/admin/updateuser/:id').put(isAuthenticatedUser, authorizeRoles('admin'),updateUser)
router.route('/admin/deleteuser/:id').delete(isAuthenticatedUser, authorizeRoles('admin'),deleteUser)

module.exports = router