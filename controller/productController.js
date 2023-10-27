const Product = require('../models/productModel')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../Middlewares/catchAsyncError')
const ApiFeatures = require('../utils/apiFeatures')
// Handler function 

// get All products ----- {{baseurl}}/api/v1/products

exports.getProducts = catchAsyncError (async(req, res, next)=>{

    const resPerPage = 3

                            //return pannura object,  req la kedaikura query
    const apiFeatures = new ApiFeatures (Product.find(), req.query).search().filter().paginate(resPerPage);
    const product = await apiFeatures.query;  //find function kulla productmodel la vaikkaporom
    const totalProductsCount = await Product.countDocuments({})

    await new Promise (resolve => setTimeout(resolve , 1000))
    // return next(new ErrorHandler('Unable to send products!',400))

    res.status(200).json({
        success: true,
        count:totalProductsCount,
        resPerPage,
        // message: "This route will show all the products in database"
        product 
    })
})
// Create Products ---- {{baseurl}}/api/v1/product/new

exports.newProduct = catchAsyncError(async (req,res,next)=>{
    //product adding user
    req.body.user= req.user.id 
    const  product = await Product.create(req.body)
    res.status(201).json({
    success: true,
    product
   })
});

//get Single Products ---- {{baseurl}}/api/v1/product/:id (get)

exports.getSingleProduct = catchAsyncError(async(req, res, next) => {
    const product = await Product.findById(req.params.id) //.populate('reviews.user','name email');

    if(!product) {
        return next(new ErrorHandler('Product not found', 400));
    }
    await new Promise(resolve=> setTimeout(resolve , 1000))
    res.status(201).json({
        success: true,
        product
    })
})

// update Product --------- {{baseurl}}/api/v1/product/:id -- put method

exports.updateProduct= async (req,res,next) =>{
     let product= await Product.findById(req.params.id);


     if(!product){
        return res.status(404).json({
            success: false,
            message: "Product Not Found"
        })
     }

     product = await Product.findByIdAndUpdate(req.params.id , req.body,{
        new: true,
        runValidators: true
        
     })

     res.status(200).json({
         success: true,
         product
     })

}

// Delete Products ------- {{baseurl}}/api/v1/product/:id -- delete method
exports.deleteProduct = async (req, res, next) =>{
    const product = await Product.findById(req.params.id);

    if(!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    await product.deleteOne();


    res.status(200).json({
        success: true,
        message: "Product Deleted!"
    })

}
//Create Review  - api/v1/review
exports.createReview = catchAsyncError( async(req,res,next)=>{
    const { productId , rating, comment} = req.body;
       
    const review = {
        user: req.user.id,
        rating,
        comment
    }

    const product = await Product.findById(productId)
    //finding user already has reviewed
       const isReviewed =  product.reviews.find(review =>{
                        // In the below two string are equal means , user already reviewed 
           return  review.user.toString() == req.user.id.toString() //user field  ethu object la kedaikum atha string ah mathikallam
        })
        if(isReviewed){
            // updating the review 
            product.reviews.forEach( review =>{
                if(review.user.toString() == req.user.id.toString()){
                    review.comment = comment
                    review.rating = rating
                }
            })
        }
        else{
            //creating the review
            product.reviews.push(review)
            product.numOfReviews = product.reviews.length;
        }
        // review ods average thaan ratings 
        //Find the average of product reviews
        product.ratings = product.reviews.reduce((acc, review)=>{
            return review.rating + acc;
        }, 0) / product.reviews.length;
       product.ratings = isNaN(product.ratings)?0:product.ratings

       await product.save({validateBeforeSave : false});

       res.status(200).json({
        success: true
       })
})
//Get Reviews : api/v1/getreview?id={productId}
exports.getReview = catchAsyncError( async(req,res,next)=>{
    const product = await Product.findById(req.query.id);

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})
//DeleteReview : api/v1/deletereview
exports.DeleteReview =catchAsyncError( async(req,res,next)=>{
    const product = await Product.findById(req.query.productId);
    //Filtering the review
    const reviews = product.reviews.filter(review =>{
        review._id.toString() !== req.query.id.toString() // equal illana atha eduthukallam
    });
    //updating the number of review
    const numOfreview = reviews.length;
     //finding the average with the filtered reviews
     let ratings = reviews.reduce((acc, review) => {
        return review.rating + acc;
    }, 0) / reviews.length;
        // NAN erunthuchuna zero va return pannu otherwise erukura ratings ah return pannu
    ratings = isNaN(ratings)?0:ratings;

    //save the product document
    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        numOfreview,
        ratings
    })
    res.status(200).json({
        success: true
    })
})
