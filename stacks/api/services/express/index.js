import cors from 'cors'
import http from 'http'
import helmet from 'helmet'
import express from 'express'
import bodyParser from 'body-parser'
import compression from 'compression'

class ExpressService {
    constructor({
        ip = '127.0.0.1',
        port = 3000,

        helmet = {
            disabled: false,
            options: {
                hsts: {
                    maxAge: 60 * 60 * 2,
                    includeSubDomains: false
                }
            }
        },

        cors = {
            disabled: false,
            options: {
                origin: '*',
                optionsSuccessStatus: 200
            }
        },

        bodyParser = {
            disabled: false,
            options: {
                json: { limit: '64mb' },
                urlencoded: { extended: true }
            }
        },

        compression = {
            disabled: false,
            options: {}
        }
    }){
        this.config = {
            ip,
            port,
            helmet,
            cors,
            compression,
            bodyParser
        }

        this.server = null
        this.app = null
        this.logger = null

        this.Initialize()
    }

    SetLogger(logger){

    }

    Initialize(){
        this.app = express()

        if(!this.config.helmet.disabled) this.app.use(helmet(this.config.helmet.options))
        if(!this.config.cors.disabled) this.app.use(cors(this.config.cors.options))
        if(!this.config.compression.disabled) this.app.use(compression(this.config.compression.options))

        if(!this.config.bodyParser.disabled){
            let bodyParserOptionKeys = Object.keys(this.config.bodyParser.options)
            bodyParserOptionKeys.map((optionKey) => {
                this.app.use(bodyParser[optionKey](this.config.bodyParser.options[optionKey]))
            })
        }
    }

    Start(){
        this.server = http.createServer(this.app)
        this.server.listen(this.config.port, this.config.ip, () => {
            console.log(`An express server is listening on ${ this.config.ip }:${ this.config.port }`)
        })
    }

    Use(...params){
        return this.app.use(...params)
    }

    Get(...params){
        return this.app.get(...params)
    }

    Post(...params){
        return this.app.post(...params)
    }

    Put(...params){
        return this.app.put(...params)
    }

    Delete(...params){
        return this.app.delete(...params)
    }
}

export default ExpressService
