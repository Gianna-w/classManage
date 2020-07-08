const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const router = express.Router()
const bcrypt = require('bcrypt')
const passport = require('passport')

//加载数据库模型
require('../models/User')
const userSchema = mongoose.model('users')

//设置bodyparser中间件
const jsonParser = bodyParser.json();
const urlencodeParser = bodyParser.urlencoded();



//路由；注册
router.get('/register',(req,res) =>{
    res.render('users/register')
})
//路由：登录
router.get('/login',(req,res) =>{
    res.render('users/login')
})

//注册验证
router.post('/register',urlencodeParser,(req,res) =>{
    const errors = [];
    if(req.body.password != req.body.password2){
        errors.push({
            text:"两次密码不一致"
        })
    }
    if(req.body.password.length < 4){
        errors.push({
            text:"密码长度不符合规范"
        })
    }
    if(errors.length > 0 ){
        res.render('users/register',{
            errors:errors,
            email:req.body.email,
            name:req.body.name
        })
    }else{
        userSchema.findOne({
            email:req.body.email
        }).then(user =>{
            if(user){
                req.flash('error_msg',"此邮箱已被注册！");
                res.redirect('/users/register');              
            }else{
                const newUser = new userSchema({
                    email:req.body.email,
                    name:req.body.name,
                    password:req.body.password
                })
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(newUser.password, salt, (err, hash) =>{
                        newUser.password = hash;
                        newUser.save().then(() =>{
                            req.flash('success_msg',"注册成功！")
                            res.redirect('/users/login');
                        })
                    });
                });
            }
        }).catch((e)=>{ console.log(e) })
    }
})

//登录验证
router.post('/login',urlencodeParser,(req,res,next) =>{
    //使用passport验证
    passport.authenticate('local', { 
        successRedirect: '/ideas',
        failureRedirect: '/users/login' ,
        failureFlash: true
    })(req,res,next)
})

router.get("/logout",(req,res) =>{
    req.logout();
    req.flash("success_msg","退出登录成功！");
    res.redirect("/users/login");
})

module.exports = router;