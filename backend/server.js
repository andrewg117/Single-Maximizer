const path = require('path')
const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const { errorHandler } = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const port = process.env.Port || 5000

connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/tracks', require('./routes/trackRoutes'))
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/email', require('./routes/emailRoutes'))
app.use('/api/image', require('./routes/imageRoutes'))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
    )
  )
} else {
  app.get('/', (req, res) => res.send('Set env to production'))
}

app.use(errorHandler)

app.listen(port, () => console.log(`Server started on port ${port}`))