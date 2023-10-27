const express = require ('express')
const app = express()
const errorMiddleware = require('./Middlewares/error')
const cookieParser = require('cookie-parser')


//json format kaga
app.use(express.json())
app.use(cookieParser())

// import routes for products, auth , order
const products = require('./Routes/product')
const auth = require('./Routes/auth')
const order = require('./Routes/order')




//middleware
app.use('/api/v1/',products)
app.use('/api/v1/',auth)
app.use('/api/v1/',order)

app.use(errorMiddleware)

module.exports = app