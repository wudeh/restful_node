const JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt;

// 要用到 Users 数据信息，要连接 mongoose
const mongoose = require('mongoose')
const User = mongoose.model('users')
const keys = require('./key')
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = keys.secretOrKey


module.exports = passport => {
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    // console.log(jwt_payload)
    // jwt_payload 是根据 token 查询到的用户信息
    User.findById(jwt_payload.id)
      .then(user => {
        if(user) {
          // 执行 done 回调函数后可以在验证 token 的路由接口中
          // 通过 req.user 获取到用户信息
          return done(null, user)
        }
        return done(null, false)
      })
      .catch(err => console.log(err))
}))
}