const EnvUpdater = require('./envUpdater')
const { program } = require('commander');
program
    .version('1.0.0')
    .option('-c, --config <string>', 'config of services')
    .parse(process.argv)

const configPath = program.config
const fs = require('fs')

if (fs.existsSync(configPath)) {
    runUpdater()
} else {
    console.log(`file ${configPath} not found`)
    process.exit()
}

async function runUpdater() {
    const config = require(configPath)
    const services = config.services
    for (let index = 0; index < services.length; index++) {
        const service = services[index]
        console.log(`--- UPDATE SERVICE ${service.name.toUpperCase()} ---`)
        const configService = {
            host: service.host,
            user: config.user,
            privateKey: config.privateKey,
            envMaster: config.envMaster,
            envService: service.env,
            preCommand: service.preCommand || '',
            postCommand: service.postCommand || ''
        }
        const envUpdater = new EnvUpdater(configService)
        await envUpdater.run()
    }
    console.log('-- COMPLETED --')
    process.exit()
}