require('dotenv').config()
const express = require('express')
const sequilize = require('./db')
const models = require('./models/models')
const cors = require('cors')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const fileUpload = require('express-fileupload')
const path = require('path')
const PORT = process.env.PORT


const start = async () => {
    try {
        await sequilize.authenticate()
        await sequilize.sync()
        app.listen(PORT,()=>console.log(`Server started on ${PORT}`))


    } catch(e){
        console.log(e)
    }
}
const app = express()
app.use(errorHandler)
app.use(cors())
app.use(express.static(path.resolve(__dirname,'static')))
app.use(express.json())
app.use(fileUpload({}))
app.use('/api',router)

start()