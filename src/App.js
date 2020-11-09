const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
const { APP_PORT } = process.env

app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(cors())

// provide static file
app.use('/uploads', express.static('assets/uploads'))

const userRoute = require('./routes/Users')
const authRoute = require('./routes/auth')
const postNewsRoute = require('./routes/PostsNews')
const categoryNewsRoute = require('./routes/CategoryNews')

app.use('/auth', authRoute)
app.use('/users', userRoute)
app.use('/posts', postNewsRoute)
app.use('/category', categoryNewsRoute)

app.get('/', (req, res) => {
  res.send({
    success: true,
    message: 'Backend is running'
  })
})

app.listen(APP_PORT, () => {
  console.log('listening on port ' + APP_PORT)
})
