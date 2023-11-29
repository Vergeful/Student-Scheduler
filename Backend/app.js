const express = require('express')
const app = express()

const cors = require('cors')
const helmet= require('helmet')

require('dotenv').config() // allows access to .env (local environment) variables via process.env
require('express-async-errors') // middleware for errors


//MIDDLEWARE:
// Built in middleware function in express that parses incoming requests with JSON payloads:
app.use(express.json());


// Middleware for security:
app.set('trust proxy', 1)
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 50 // 50 requests can be made per windowMs
}))
app.use(cors())
app.use(helmet())
app.use(rateLimit())


// Middleware






// Routes



const port = process.env.PORT || 3000

const start = async () =>{
    try{
        // Connection here
        app.listen(port, () => console.log(`Server is listening on port ${port}...`))
    }catch(error){
        console.log(error)
    }
}

start()
