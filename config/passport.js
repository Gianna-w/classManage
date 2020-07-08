const LocalStrategy =  require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

//加载模型
const userSchema = mongoose.model('users')

module.exports  = (passport) =>{
    passport.use(new LocalStrategy(
        {usernameField:'email'},
        (email, password, done) =>{
            userSchema.findOne({
                email:email
            }).then(user =>{
                if(!user){
                    return done(null, false, {message:"用户不存在!"});
                }
                bcrypt.compare(password, user.password, (err, isMatch) =>{
                    if(err) throw err
                    if(isMatch){
                        return done(null, user);
                    }else{
                        return done(null, false, {message:"密码错误!"});
                    }
                })
            })
        }
    ));
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
        userSchema.findById(id, function (err, user) {
            done(err, user);
        });
    });
}