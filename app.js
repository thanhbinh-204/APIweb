require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const cors = require('cors');

const { mongoose } = require('mongoose');
//Gọi các model
// gọi theo thứ tự từ cha đến con
require('./controllers/user/userModel');
require('./controllers/product/ModelProduct');
require('./controllers/carts/ModelCart');
require('./controllers/categories/ModelCategory');
require('./controllers/voucher/ModelVoucher');
require('./controllers/supply/ModelSupply');
require('./controllers/feedback/ModelFeedback');




var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const categoriesRouter = require('./routes/categories');
const vouchersRouter = require('./routes/vouchers');
const supplysRouter = require('./routes/supplys');
const feedbackRouter = require('./routes/feedbacks');
const paymentRouter = require('./routes/payments');






var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors()); //mở cổng để các hệ thống khác truy cập

//----------------------------------------
//Kết nối với mongoose: mongodb+srv://tth06102004:0902851922@cluster0.s89ky.mongodb.net/dataManT?retryWrites=true&w=majority&appName=Cluster0
mongoose.connect('mongodb://localhost:27017/APIDUAN')
  .then(() => { console.log('Connect succes') })
  .catch(() => { console.log('Fail') })

//localhost:8080/users
app.use('/users', usersRouter);

// http://localhost:8080/products
app.use('/products', productsRouter);

// http://localhost:8080/carts
app.use('/carts', cartsRouter);

// http://localhost:8080/categories
app.use('/categories', categoriesRouter);

// http://localhost:8080/vouchers
app.use('/vouchers', vouchersRouter);

// http://localhost:8080/supplys
app.use('/supplys', supplysRouter);

// http://localhost:8080/feedbacks
app.use('/feedbacks', feedbackRouter);

// http://localhost:8080/payments
app.use('/payments', paymentRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});





module.exports = app;
