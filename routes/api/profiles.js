const express = require('express')
const router = express.Router()
const Profile = require('../../model/Profile')
const passport = require('passport')

/**
 * @route GET api/profiles/test
 * @desc  测试 profile 接口
 * @access public
 */
router.get('/test', (req, res) => {
  res.json({msg:"profile works"})
})

/**
 * @route POST  api/profiles/add
 * @desc  添加 profile
 * @access  private
 */
router.post('/add', passport.authenticate('jwt', {session: false}), (req, res) => {
  const profileFileds = {}
  if(req.body.type) profileFileds.type = req.body.type
  if(req.body.describe) profileFileds.describe = req.body.describe
  if(req.body.income) profileFileds.income = req.body.income
  if(req.body.expend) profileFileds.expend = req.body.expend
  if(req.body.cash) profileFileds.cash = req.body.cash
  if(req.body.remark) profileFileds.remark = req.body.remark
  new Profile(profileFileds).save()
    .then(profile => {
      res.json(profile)
    })
})

/**
 * @route GET  api/profiles/edit/:id
 * @desc  编辑 profile
 * @access  private
 */
router.post('/edit/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  console.log
  const profileFileds = {}
  if(req.body.type) profileFileds.type = req.body.type
  if(req.body.describe) profileFileds.describe = req.body.describe
  if(req.body.income) profileFileds.income = req.body.income
  if(req.body.expend) profileFileds.expend = req.body.expend
  if(req.body.cash) profileFileds.cash = req.body.cash
  if(req.body.remark) profileFileds.remark = req.body.remark
  // 第一个参数是查询条件对象，第二个参数是修改后的数据，第三个参数是确定修改
  Profile.findOneAndUpdate({_id: req.params.id}, {$set: profileFileds}, {new: true})
    .then(profile => {
      if(!profile) {
        return res.json({errcode: 500, msg: '修改失败'})
      }
      return res.json(profile)
    })
    .catch(err => res.json({errcode: 500, msg: '服务器出错'}))
})

/**
 * @route DELETE  api/profiles/delete/:id
 * @desc  删除 profile
 * @access  private
 */
router.delete('/delete/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  Profile.findOneAndDelete({_id: req.params.id})
    .then(profile => {
      // 临时保存删除的数据返回给前端
      profile.save()
        .then(profile => res.json({profile,msg:'删除成功'}))
    })
    .catch(err => res.status(404).json({errcode: 500, msg: '服务器出错，可能未成功删除'}))
})

/**
 * @route GET api/profiles
 * @description 获取所有 profile 信息
 * @access private
 */
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  Profile.find()
    .then(profiles => {
      if(!profiles) {
        return res.status(404).json({errcode: 500, msg: '未查找到信息'})
      }
      return res.json(profiles)
    })
    .catch(err => res.status(404).json({msg:'服务器错误'}))
})

/**
 * @route GET api/profiles/:id
 * @description 获取一条 profile 信息
 * @access private
 */
router.get('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  Profile.findOne({_id: req.params.id})
    .then(profile => {
      if(!profile) {
        return res.status(404).json({errcode: 500, msg: '未查找到信息'})
      }
      return res.json(profile)
    })
    .catch(err => res.status(404).json({msg:'服务器错误'}))
})
module.exports = router