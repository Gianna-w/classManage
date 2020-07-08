const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const router = express.Router()
const { ensureAuthenticated } = require("../helpers/auth")

//引入数据库model
require('../models/Idea')
const IdeaSchema = mongoose.model('ideas');

//设置bodyparser中间件
const jsonParser = bodyParser.json();
const urlencodeParser = bodyParser.urlencoded();

//路由：添加页面
router.get('/add',ensureAuthenticated,(req,res) =>{
    res.render('ideas/add')
})
//路由：课程列表页面
router.get('/',ensureAuthenticated,(req,res) =>{
    IdeaSchema.find({user:req.user.id}).sort({date:'desc'}).then(ideas =>{
        res.render('ideas/index',{
            ideas:ideas
        })
    })
})
//路由：编辑页面
router.get('/edit/:id',ensureAuthenticated,(req,res) =>{
    IdeaSchema.findOne({
        _id:req.params.id
    }).then(idea =>{
        if(idea.user != req.user.id){
            req.flash("error_msg","非法操作～");
            res.redirect('/ideas');
        }else{
            res.render('ideas/edit',{ idea: idea});
        }
    })
})

//数据处理：添加
router.post('/',urlencodeParser,(req,res) =>{
    const errors = [];
    if(!req.body.title){
        errors.push({text:"请输入标题！"});
    }
    if(!req.body.details){
        errors.push({text:"请输入内容！"});
    }
    if(errors.length > 0){
        res.render('ideas/add',{
            errors:errors,
            title:req.body.title,
            details:req.body.details
        })
    }else{
        const Idea = {
            user:req.user.id,
            title:req.body.title,
            details:req.body.details
        }
        new IdeaSchema(Idea).save().then(() =>{
            req.flash('success_msg',"添加成功");
            res.redirect('/ideas')
        })
    }
})
//数据处理：编辑
router.put('/:id',urlencodeParser,(req,res) =>{
    IdeaSchema.findOne({
        _id:req.params.id
    }).then(idea =>{
        idea.title = req.body.title;
        idea.details = req.body.details;
        const errors = [];
        if(!idea.title){
            errors.push({text:"请输入标题！"});
        }
        if(!idea.details){
            errors.push({text:"请输入内容！"});
        }
        if(errors.length > 0){
            res.render('ideas/edit',{
                errors:errors,
                idea:{
                    id:req.params.id,
                    title:req.body.title,
                    details:req.body.details
                }
            })
        }else{
            idea.save().then(() =>{
                req.flash('success_msg',"编辑成功");
                res.redirect('/ideas');
            })
        }
    })
})
//数据处理：删除
router.delete('/delete/:id',ensureAuthenticated,(req,res) =>{
    IdeaSchema.remove({
        _id:req.params.id
    }).then(() =>{
        req.flash('success_msg',"删除成功");
        res.redirect('/ideas');
    })
})

module.exports = router