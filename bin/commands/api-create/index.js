const webpack = require('webpack')
const { spawn } = require('child_process')
const nodemon = require('nodemon')
const path = require('path')
const fs = require('fs')
const fsJetpack = require('fs-jetpack')
const ejs = require('ejs')
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

const StartTask = async (task, args = []) => {
    return new Promise((resolve, reject) => {
        const taskInstance = spawn(task, args, { stdio: 'inherit' })
        taskInstance.on('close', (code) => { resolve() })
        taskInstance.on('error', (err) => { console.error(err); process.exit(1) })
    })
    
}


const command = new Command({
    name: 'run [options] [name]',
    options: moduleConfig.options,
    action: async (commandInstance, appName = 'manablox-api') => {
        const commandPath = path.resolve(__dirname)
        const workPath = process.cwd()

        const sourcePath = `${ commandPath.replace('/bin/commands/api-create', '') }/stacks/api`
        const targetPath = `${ workPath }`

        const source = fsJetpack.list(sourcePath)

        const sourceFolders = source.filter((item) => {
            return fsJetpack.inspect(`${ sourcePath }/${ item }`).type == 'dir'
        })

        const sourceFiles = source.filter((item) => {
            return fsJetpack.inspect(`${ sourcePath }/${ item }`).type != 'dir'
        })

        sourceFolders.map((folder) => {
            let target = `${ targetPath }/${ folder }`
            fsJetpack.remove(target)
            fsJetpack.copy(`${ sourcePath }/${ folder }`, target)
        })

        sourceFiles.map((file) => {
            let target = `${ targetPath }/`
            let isEjs = false

            if(file.endsWith('.ejs')){
                file = file.replace('.ejs', '')
                isEjs = true
            }

            target += file

            if(isEjs){
                let parser = 'babel'
                let type = 'bash'

                let fileNameParts = file.split('.')
                if(fileNameParts.length > 1) type = fileNameParts.reverse()[0]

                switch(type){
                    case 'json': parser = 'json'; break
                    case 'bash': parser = 'markdown'; break
                    case 'md': parser = 'markdown'; break
                }

                let fileContent = fsJetpack.read(`${ sourcePath }/${ file }.ejs`)
                let renderedFileContent = ejs.render(fileContent, { 
                    name: appName,
                    repository: '[TODO]',
                    author: '[TODO]'
                })

                let mode = '644'
                if(type == 'bash') mode = '647'

                fsJetpack.remove(target)
                fsJetpack.file(target, { content: renderedFileContent, mode: mode })
            }else{
                fsJetpack.remove(target)
                fsJetpack.copy(`${ sourcePath }/${ file }`, target)
            }
        })

        console.log(`${ appName } instance created`)

        fsJetpack.remove(`${ targetPath }/node_modules`)
        fsJetpack.remove(`${ targetPath }/yarn.lock`)

        
        await StartTask('yarn', ['--ignore-scripts'])
        await StartTask('yarn', ['datatypes:create'])

        // make a clone of the api stack
        // fsJetpack.remove(targetPath)
        // fsJetpack.copy(sourcePath, targetPath)



        // const runAfterBuild = !!commandInstance.run
        // const runOnly = !!commandInstance.runOnly
        // const asService = !!commandInstance.asService

        // if(!scriptFilename) scriptFilename = 'index.js'

        // if(!scriptFilename.endsWith('.js')){
        //     scriptFilename = path.join(scriptFilename, 'index.js')
        // }


        // paths.sourcePath = path.join(process.cwd(), scriptFilename)
        // paths.sourceFile = scriptFilename.replace(/\//g, '_')

        // // paths.sourcePath = path.join(process.cwd(), scriptFilename)
        // // paths.sourceFile = paths.sourcePath.split(path.sep).reverse()[0]

        
        // const configPath = path.resolve('manablox.config.js')
        // const options = {
        //     env: process.env.NODE_ENV || 'production',
        //     paths
        // }

        // let userConfig = {}
        // if(fs.existsSync(configPath)){
        //     const userConfigModule = require(configPath)
        //     userConfig = userConfigModule.default || userConfigModule
        // }

        // const serverConfig = userConfig.webpack
        //     ? userConfig.webpack(defaultConfig(options), options, webpack)
        //     : defaultConfig(options)


        // process.on('SIGINT', process.exit)

        // if(!runOnly){
        //     const serverCompiler = webpack(serverConfig)
        //     serverCompiler.run((error, stats) => {
        //         if(error || stats.hasErrors()){
        //             console.error(error)
        //             process.exitCode = 1
        //         }

        //         if(runAfterBuild) BuildRunner(asService)
        //     })

        //     return
        // }

        // if(runAfterBuild || runOnly) BuildRunner(asService)
    }
})

command.Run()
