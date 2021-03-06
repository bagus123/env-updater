const fs = require('fs')
const NodeSSH = require('node-ssh')
const readline = require('readline')
const LOCAL_PATH = __dirname

class EnvUpdater {
    constructor(config) {

        this.host = config.host
        this.user = config.user
        this.privateKey = config.privateKey
        this.envService = config.envService
        this.envMaster = config.envMaster
        this.preCommand = config.preCommand
        this.postCommand = config.postCommand
        this.ssh = new NodeSSH()

        const fileName = this.envService.substring(this.envService.lastIndexOf('/') + 1);

        this.localPathFile = LOCAL_PATH + '/tmp/' + fileName + '.local'
        this.localModifiedFile = LOCAL_PATH + '/tmp/' + fileName + '.local.modified'
        this.allFields = {}

        const tempPath = LOCAL_PATH + '/tmp'
        if (!fs.existsSync(tempPath)) {
            fs.mkdirSync(tempPath)
        }
    }


    async _connect() {
        await this.ssh.connect({
            host: this.host,
            username: this.user,
            privateKey: this.privateKey
        })
        return true
    }

    _readEnvMaster() {
        return new Promise((resolve, reject) => {
            const rl = readline.createInterface({
                input: fs.createReadStream(this.envMaster),
                crlfDelay: Infinity
            })

            rl.on('line', (line) => {
                if (line.indexOf('=') > -1 && !line.startsWith('#')) {
                    const arrLine = line.split('=')
                    const key = arrLine[0]
                    const value = arrLine[1]
                    this.allFields[key] = value
                }
            })

            rl.on('close', () => {
                resolve()
            })
        })

    }

    async _getFile() {
        try {
            await this.ssh.getFile(this.localPathFile, this.envService)
            return true
        } catch (error) {
            throw Error('failed get env file from server')
        }
    }

    _createNewEnv() {
        return new Promise((resolve, reject) => {
            const rl = readline.createInterface({
                input: fs.createReadStream(this.localPathFile),
                crlfDelay: Infinity
            })

            let newContent = ''
            rl.on('line', (line) => {
                if (line.indexOf('=') > -1 && !line.startsWith('#')) {
                    const arrLine = line.split('=')
                    const key = arrLine[0]
                    if (this.allFields[key]) {
                        const value = this.allFields[key]
                        const field = `${key}=${value}`
                        line = field
                    }
                }
                newContent += line + '\n'
            })

            rl.on('close', () => {
                fs.writeFileSync(this.localModifiedFile, newContent)
                resolve()
            })

        })
    }

    async _putNewEnv() {
        try {
            await this.ssh.putFile(this.localModifiedFile, this.envService)
            return true
        } catch (error) {
            throw Error('failed put new env to server')
        }
    }

    async _preCommand() {
        if (this.preCommand !== null && this.preCommand !== '') {
            const result = await this.ssh.execCommand(this.preCommand)
            console.log(result.stdout)
            console.log(result.stderr)
        }
        return true
    }

    async _postCommand() {
        if (this.postCommand !== null && this.postCommand !== '') {
            const result = await this.ssh.execCommand(this.postCommand)
            console.log(result.stdout)
            console.log(result.stderr)
        }
        return true
    }

    async _cleanUp() {
        fs.unlinkSync(this.localPathFile)
        fs.unlinkSync(this.localModifiedFile)
        this.ssh.dispose()
        return true
    }

    async run() {
        try {
            await this._readEnvMaster()
            await this._connect()
            await this._getFile()
            await this._preCommand()
            await this._createNewEnv()
            await this._putNewEnv()
            await this._postCommand()
            await this._cleanUp()
            return true
        } catch (error) {
            console.error(error)
        }
    }

}

module.exports = EnvUpdater