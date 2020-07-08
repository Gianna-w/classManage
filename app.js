const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')

const app = express();

//连接mongodb
mongoose.connect("mongodb+srv://Gianna:802907@cluster0-ez7nt.mongodb.net/test?retryWrites=true&w=majority")
.then(() =>{
    console.log("Mongodb connected...")
}).catch((err) =>{
    console.log(err)
})

//静态托管
app.use(express.static(path.join(__dirname,'public')))
//设置模板引擎中间件
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
  }));
app.set('view engine', 'handlebars');

//设置method中间件
app.use(methodOverride('_method'))

//设置session中间件
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

//设置flash中间件
app.use(flash())

//配置全局变量
app.use((req,res,next) =>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})

//加载路由
const ideas = require('./router/ideas')
const users = require('./router/users')

//路由：首页
app.get('/',(req,res) =>{
    res.render('index')
})
//路由：关于我们
app.get('/about',(req,res) =>{
    res.render('about')
})
//使用路由
app.use("/ideas",ideas)
app.use("/users",users)

//引入passport
require('./config/passport')(passport)

//监听端口
let port = process.env.PORT || 30010;
app.listen(port,() =>{
    console.log('server is running...');
})