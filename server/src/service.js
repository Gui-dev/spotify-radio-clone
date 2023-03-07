import fs from 'node:fs'
import { access } from 'node:fs/promises'
import { extname, join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { PassThrough } from 'node:stream'

import config from './config.js'

export class Service {
  constructor() {
    this.clientStreams = new Map()
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
