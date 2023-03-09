import fs from 'node:fs'
import { access } from 'node:fs/promises'
import { extname, join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { PassThrough, Writable } from 'node:stream'
import childProcess from 'node:child_process'
import { pipeline } from 'node:stream/promises'
import { once } from 'node:events'
import Throttle from 'throttle'

import { logger } from './util/logger.js'
import config from './config.js'

export class Service {
  constructor() {
    this.clientStreams = new Map()
    this.currentSong = config.constants.englishConversation
    this.currentBitRate = 0
    this.throttleTransform = {}
    this.currentReadable = {}
  }

  broadCast () {
    return new Writable({
      write: (chunk, encode, callback) => {
        for (const [id, stream] of this.clientStreams) {
          if (stream.writableEnded) {
            this.clientStreams.delete(id)
            continue
          }
          stream.write(chunk)
        }
        callback()
      }
    })
  }

  async startStreamming () {
    logger.info(`starting with ${this.currentSong}`)
    const bitRate = this.currentBitRate = (await this.getBitRate(this.currentSong) / config.constants.bitRateDivisor)
    const throttleTransform = this.throttleTransform = new Throttle(bitRate)
    const songReadable = this.currentReadable = this.createFileStream(this.currentSong)
    return pipeline(
      songReadable,
      throttleTransform,
      this.broadCast()
    )
  }

  stopStreamming () {
    this.throttleTransform?.end?.()
  }

  createClientStream () {
    const id = randomUUID()
    const clientStream = new PassThrough()
    this.clientStreams.set(id, clientStream)
    return {
      id,
      clientStream
    }
  }

  removeClientStream (id) {
    this.clientStreams.delete(id)
  }

  _executeSoxCommand (args) {
    return childProcess.spawn('sox', args)
  }

  async getBitRate (song) {
    try {
      const args = [
        '--i', // info
        '-B',  // bitrate
        song
      ]
      /**
       * stderr => tudo que é erro
       * stdout => tudo que é log
       * stdin => enviar dados como stream
       */
      const { stderr, stdout, stdin } = this._executeSoxCommand(args)
      await Promise.all([
        once(stdout, 'readable'),
        once(stderr, 'readable')
      ])
      const [success, error] = [stdout, stderr].map(stream => stream.read())
      if (error) {
        return await Promise.reject(error)
      }

      return success.toString().trim().replace(/k/, '000')
    } catch (error) {
      logger.error(`Deu erro no bitrate ${error}`)
      return config.constants.fallbackBitRate
    }
  }

  createFileStream (filename) {
    return fs.createReadStream(filename)
  }

  async getFileInfo (file) {
    const fullFilePath = join(config.dir.publicDirectory, file)
    await access(fullFilePath)
    const fileType = extname(fullFilePath)
    return {
      type: fileType,
      name: fullFilePath
    }
  }

  async getFileStream (file) {
    const { name, type } = await this.getFileInfo(file)
    return {
      stream: this.createFileStream(name),
      type
    }
  }
}
