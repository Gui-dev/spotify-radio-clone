import fs from 'node:fs'
import { access } from 'node:fs/promises'
import { extname, join } from 'node:path'

import config from './config.js'

export class Service {
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
