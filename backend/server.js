const path = require('path')
const express = require('express')
// const cors = require('cors')
const colors = require('colors')
const dotenv = require('dotenv').config()
const schedule = require('node-schedule')
const cookieParser = require('cookie-parser')
const { sendScheduledEmail } = require('./controllers/emailController')
const { errorHandler } = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const { route } = require('./routes/webhookRoutes')
const port = process.env.Port || 5000

connectDB()

const app = express()

// Daily function
schedule.scheduleJob({ minute: 30 }, function () {
  // sendScheduledEmail()
})

app.use('/api/webhook', require('./routes/webhookRoutes'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


app.use('/api/tracks', require('./routes/trackRoutes'))
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/email', require('./routes/emailRoutes'))
app.use('/api/image', require('./routes/imageRoutes'))
app.use('/api/audio', require('./routes/audioRoutes'))
app.use('/api/purchase', require('./routes/purchaseRoutes'))

// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../frontend/build')))
//   // app.use(express.static('frontend/build'))
//   // app.use(express.static(process.env.RENDER_STATIC_URL))

//   app.get('*', (req, res) =>
//     res.sendFile(
//       path.resolve(__dirname, 'frontend', 'build', 'index.html')
//       // path.resolve(process.env.RENDER_STATIC_URL, '../', 'frontend', 'build', 'index.html')
//     )
//   )
// } else {
//   app.get('/', (req, res) => res.send('Set env to production'))
// }

// List routes
// app.use(errorHandler)
// require('./routes/userRoutes').stack.forEach((item) => {
//   console.log(item.route.stack[0].method + ': ' + item.route.path)
// })

app.get('/', (req, res) => {
  res.json({ Connection: 'Success' })
})

app.listen(port, () => console.log(`Server started on port ${port}`))