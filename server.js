const express = require('express')
const mongoose = require('mongoose')
const app = express()
const bodyParser = require('body-parser')
const passport = require('passport')
const users = require('./routes/api/users')
const profiles = require('./routes/api/profiles')
const db = require('./config/key').mongooseURL

// passport 初始化
app.use(passport.initialize())

require("./config/passport")(passport)

// 连接在线 mongoose 数据库
mongoose.connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log('mongoose connected')
  })
  .catch(err => {
    console.log('连接 mongodb 在线数据库出错')
  })


app.get('/', (req, res) => {
  res.send('hello world')
})

// 配置模板引擎和 body-parser 一定要在 app.use(router) 挂载路由之前
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



// 挂载路由
app.use("/api/users", users)
app.use('/api/profiles', profiles)

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`server is running at port ${port}`)
})
