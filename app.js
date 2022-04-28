var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

// user
var loginRouter = require('./routes/user_login')
var logoutRouter = require('./routes/user_logout')
var signupRouter = require('./routes/user_signup')


// Admin
var adminloginRouter = require('./routes/a_login')
var create_productRouter = require('./routes/a_create_product')
var view_productsRouter = require('./routes/a_view_products')
var a_pro_brandRouter = require('./routes/a_pro_brand')
var a_pro_brand_catRouter = require('./routes/a_pro_brand_cat')
var create_brandRouter = require('./routes/a_create_brand')
var create_categoryRouter = require('./routes/a_create_category')
var upload_product_imagesRouter = require('./routes/a_upload_product_images')



// both
var brandsRouter = require('./routes/brands')
var categoriesRouter = require('./routes/categories')



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);


// user
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/signup', signupRouter);



// admin
app.use('/admin_login', adminloginRouter);
app.use('/create_product', create_productRouter);
app.use('/view_products', view_productsRouter);
app.use('/brand_products', a_pro_brandRouter);
app.use('/brand_cat_products', a_pro_brand_catRouter);
app.use('/create_brand', create_brandRouter);
app.use('/create_categories', create_categoryRouter);
app.use('/upload_product_images', upload_product_imagesRouter);



// both
app.use('/brands', brandsRouter);
app.use('/categories', categoriesRouter);






// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
