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
const authRoute = require('./routes/Auth')
const newsArticleRoute = require('./routes/NewsArticle')
const categoryNewsRoute = require('./routes/CategoryNews')
const tagNewsRoute = require('./routes/TagsNews')
const likesRoute = require('./routes/Likes')
const commentRoute = require('./routes/Comments')

app.use('/auth', authRoute)
app.use('/users', userRoute)
app.use('/news', newsArticleRoute)
app.use('/category', categoryNewsRoute)
app.use('/tags', tagNewsRoute)
app.use('/likes', likesRoute)
app.use('/comments', commentRoute)

app.get('*', (req, res) => {
  res.status(404).send({
    success: false,
    message: 'Error route not found'
  })
})

app.get('/', (req, res) => {
  res.send({
    success: true,
    message: 'Backend is running'
  })
})

app.listen(APP_PORT, () => {
  console.log('listening on port ' + APP_PORT)
})
