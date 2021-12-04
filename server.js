const express = require('express')
const app = express()
const routes = require('./src/routes/index')
const i18n = require('./src/i18n/i18n')
const bodyParser = require('body-parser')
const db = require('./src/database/db')
const cors = require('cors')

require('dotenv').config()
var http = require('http').createServer(app);
var io = require('socket.io')(http);
require('./src/sockets/playerConnection')(io)


app.use(cors())
app.use(i18n)
app.use(express.static('public'))
app.use(bodyParser.json({ limit: "50mb" }))
app.use('/',routes)
app.use(express.urlencoded({ extended: true }))

// app.listen(3000 , () => {
//     console.log('server started.')
// })

http.listen(8000, () => console.log('serverstarte on : 8000'));