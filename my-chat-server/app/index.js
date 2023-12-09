require('dotenv').config()
const cors = require('cors')
const express = require('express')
const path = require('path')
const { allRoutes } = require('./routers/router')
const createHttpError = require('http-errors')
const { default: mongoose } = require('mongoose')
const cookieParser = require("cookie-parser")
const session = require('express-session')
const app = express()


module.exports = class Application {
    #DB_URL 
    #PORT

    constructor(DB_URL , PORT){
        this.#PORT = PORT 
        this.#DB_URL = DB_URL
        this.serverConfig()
        this.appConfig()
        this.initClientSession()
        this.routeHandler()
        this.errorHandling()
        this.connectDB()

    }


    serverConfig  = ()=>{
        const http = require('http')
        const server = http.createServer(app)
        server.listen(this.#PORT , ()=>{
            console.log(`server ran on http://localhost:${this.#PORT}`);
        })
    }

    connectDB= ()=>{
        mongoose.connect(this.#DB_URL).then(()=>{
            console.log("connected to data base")
            process.on('SIGINT' , ()=>{
                mongoose.disconnect()
                process.exit(0)
            }) 
        }).catch((err)=> console.log(err))
    }

    appConfig = ()=>{
        app.use(express.json())
        app.use(express.urlencoded({extended:true}))
        app.use(express.static(path.join(__dirname,'..', 'public')))
        app.use(cors({origin:"http://localhost:3000" , credentials:true}))
    }

    initClientSession(){
        app.use(cookieParser(process.env.COOKIE_PARSER_KEY))
        app.use(session({
          secret: process.env.COOKIE_PARSER_KEY,
          resave: true,
          saveUninitialized: true,
          cookie: {
            secure: false
          }
        }))
      }

    routeHandler = ()=>{
        app.use(allRoutes)
    }

    errorHandling = ()=>{
        app.use((req , res , next)=>{
            try {
                throw createHttpError.NotFound("couldn't find the address")
            } catch (error) {
                next(error)
            }
        })

        app.use((err , req , res , next)=>{
            const serverError = createHttpError.InternalServerError()
            const statusCode = err.statusCode || serverError.statusCode
            const message = err.message || serverError.message
            return res.status(statusCode).json({
                statusCode , 
                data: {
                    message
                }
            })
        })
    }


}

