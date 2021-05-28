const express = require('express')
const router = express.Router()
const User = require('../../model/Users')
const MD5 = require('md5.js')
const gravatar = require('gravatar')
const jwt = require('jsonwebtoken')
const keys = require('../../config/key')
const passport = require('passport')

/**
 * 
 */
router.get('/test', (req, res) => {
  res.json({msg:"users-router works"})
})

// 注册接口
router.post('/register', (req, res) => {
  User.findOne({email: req.body.email})
    .then(user => {
      if (user) {
        return res.json({errcode: 500, msg: '邮箱已被注册'})
      }else {
        const avatar = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'});
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password,
          identity: req.body.identity
        })
        newUser.password = new MD5().update(req.body.password).digest('hex')
        newUser.save()
          .then(user => res.json({errcode: 200, user, msg: '注册成功!'}))
          .catch(err => console.log(err))
      }
    })
})
/**
 * $route POST api/user/login
 * @description 成功登陆返回 token
 * @access public
 */
router.post('/login', (req, res) => {
  const email = req.body.email
  const password = req.body.password
  User.findOne({email})
    .then(user => {
      if(!user) {
        return res.json({errcode: 500, msg: '用户邮箱不存在'})
      }
      const matchPassword = new MD5().update(password).digest('hex')
      if(matchPassword != user.password) {
        return res.json({errcode: 500, msg: '密码错误'})
      }else {
        const rule = {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          identity: user.identity
        }
        jwt.sign(rule, keys.secretOrKey, {expiresIn: 3600}, (err, token) => {
          if(err) return res.json({errcode: 500})
          res.json({
            errcode: 200,
            token: 'Bearer ' + token
          })
        })
      }
    })
})

/**
 * $route GET api/user/current
 * @description 验证 token,返回当前用户信息
 * @access private
 */
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    identity: req.user.identity
  })
})
module.exports = router