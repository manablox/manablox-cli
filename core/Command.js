const commander = require('commander')

class Command {
    constructor(settings){
        this.settings = settings
        this.command = commander.command(this.settings.name)

        if(this.settings.options){
            for(let i = 0; i < this.settings.options.length; i++){
                const option = this.settings.options[i]
                this.command.option(option.flags, option.description)
            }
        }

        this.command.action((...args) => {
            this.settings.action(this.command, ...args)
        })
    }

    Run(){
        commander.parse(process.argv)
    }

}

module.exports = Command
