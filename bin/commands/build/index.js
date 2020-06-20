const webpack = require('webpack')
const { spawn } = require('child_process')
const nodemon = require('nodemon')
const path = require('path')
const fs = require('fs')
const paths = require('../../../config/paths')
const defaultConfig = require('../../../config/webpack.config')
const moduleConfig = require('./config')
const Command = require('../../../core/Command')


const BuildRunner = (asService) => {
    if(asService) return nodemon({ script: path.join(paths.buildPath, paths.sourceFile), watch: paths.buildPath }).on('quit', process.exit)

    const buildInstance = spawn('node', [path.join(paths.buildPath, paths.sourceFile)], { stdio: 'inherit' })
    buildInstance.on('close', (code) => { process.exit(code) })
    buildInstance.on('error', (err) => { console.error(err); process.exit(1) })
}


const command = new Command({
    name: 'run [options] [file]',
    options: moduleConfig.options,
    action: (commandInstance, scriptFilename) => {
        const runAfterBuild = !!commandInstance.run
        const runOnly = !!commandInstance.runOnly
        const asService = !!commandInstance.asService

        if(!scriptFilename) scriptFilename = 'index.js'

        if(!scriptFilename.endsWith('.js')){
            scriptFilename = path.join(scriptFilename, 'index.js')
        }


        paths.sourcePath = path.join(process.cwd(), scriptFilename)
        paths.sourceFile = scriptFilename.replace(/\//g, '_')

        // paths.sourcePath = path.join(process.cwd(), scriptFilename)
        // paths.sourceFile = paths.sourcePath.split(path.sep).reverse()[0]

        
        const configPath = path.resolve('manablox.config.js')
        const options = {
            env: process.env.NODE_ENV || 'production',
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

        if(!runOnly){
            const serverCompiler = webpack(serverConfig)
            serverCompiler.run((error, stats) => {
                if(error || stats.hasErrors()){
                    console.error(error)
                    process.exitCode = 1
                }

                if(runAfterBuild) BuildRunner(asService)
            })

            return
        }

        if(runAfterBuild || runOnly) BuildRunner(asService)
    }
})

command.Run()
