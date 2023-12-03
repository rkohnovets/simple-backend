const express = require('express')
const https = require('https');
const cors = require('cors')
const mongoose = require('mongoose')

const config = require('./config')
const authRouter = require('./auth/authRouter')

const app = express()
const server = https.createServer({key: config.key, cert: config.cert }, app);

app.use(cors())
app.use(express.json())
app.use('/auth', authRouter)

const start = async () => {
    try {
        await mongoose.connect(config.mongo_conn_str)
        //app.listen(config.port, //http
        server.listen(config.port, //https
            () => {
            console.log(`server started on ${config.port}`)
        })
    }
    catch(e) {
        console.log(`server not started, error: ${e}`)
    }
}

start()