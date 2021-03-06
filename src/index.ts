import { Client } from 'discord.js'
import * as loggerBase from 'log4js'
import functions from './functions'
import * as functionBase from './functionBase'
import { config, Config } from './config'

// const pidusage = require('pidusage')

try {
  const client = new Client({
    fetchAllMembers: true
  })
  const PREFIX = config.prefix

  const logger = loggerBase.getLogger()
  
  if (process.env.NODE_ENV === 'production') {
    logger.level = 'INFO'
  } else if (process.env.NODE_ENV === 'development') {
    logger.level = 'DEBUG'
  } else {
    logger.level = 'DEBUG'
    process.env.NODE_ENV = 'development'
  }
  logger.info(`${process.env.NODE_ENV} mode`)

  client.on('ready', () => {
    logger.info(`Logged in as ${client.user.tag}!`)
    logger.debug('Debug Mode!')
    client.user.setStatus('online')
    client.user.setActivity(`Hello!`, {
      type: 'PLAYING'
    })
  });

  const loadFunctions: {
    [index: string]:
      functionBase.message
  } = {}

  for (let key in functions) {
    loadFunctions[key] = new functions[key](client, PREFIX, logger)
    loadFunctions[key].run()

    logger.debug('function ' + key + 'successfuly load')
  }

  /* async function processStatus () {
    try {
      let usage = await pidusage(process.pid)
      logger.info(`memory: ${( usage.memory / 1024 / 1024 ).toFixed(4)}MiB, ` +
        `cpu: ${usage.cpu.toFixed(4)}%, ` +
        `uptime: ${process.uptime().toFixed(2)}sec`)
    } catch (err) {
      logger.error(err.message)
      logger.trace(err.stack)
    }
  }
  setTimeout(processStatus, 10 * 1000)
  setInterval(processStatus, 60 * 1000) */

  client.login(config.apiKey.discord)
} catch (e) {
  console.log(e)
}
