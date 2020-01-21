const webpack = require('webpack')
const nodemon = require('nodemon')
const path = require('path')
const fs = require('fs')
const once = require('ramda').once
const paths = require('../../../config/paths')
const defaultConfig = require('../../../config/webpack.config')
const moduleConfig = require('./config')
const Command = require('../../../core/Command')

const command = new Command({
    name: 'run [options] [file]',
    options: moduleConfig.options,
    action: (commandInstance, scriptFilename) => {
        if(!scriptFilename) scriptFilename = 'index.js'

        if(!scriptFilename.endsWith('.js')){
            scriptFilename = path.join(scriptFilename, 'index.js')
        }

        paths.sourcePath = path.join(process.cwd(), scriptFilename)
        paths.sourceFile = paths.sourcePath.split(path.sep).reverse()[0]

        const configPath = path.resolve('manablox.config.js')
        const options = {
            env: process.env.NODE_ENV || 'development',
            paths
        }

        let userConfig = {}
        if(fs.existsSync(configPath)){
            const userConfigModule = require(configPath)
            userConfig = userConfigModule.default || userConfigModule
        }

        const serverConfig = userConfig.webpack
            ? userConfig.webpack(defaultConfig(options), options, webpack)
            : defaultConfig(options)


        process.on('SIGINT', process.exit)


        const serverCompiler = webpack(serverConfig)

        const startServer = () => {
            const serverPaths = Object
                .keys(serverCompiler.options.entry)
                .map(entry => path.join(serverCompiler.options.output.path, `${ paths.sourceFile }`))

            nodemon({
                exec: 'node',
                script: serverPaths[0],
                watch: serverPaths,
                nodeArgs: [...process.argv.slice(2)]
            }).on('quit', process.exit)
        }

        const startServerOnce = once((err, stats) => {
            if(err) return
            startServer()
        })
        serverCompiler.watch(serverConfig.watchOptions || {}, startServerOnce)
    }
})

command.Run()
