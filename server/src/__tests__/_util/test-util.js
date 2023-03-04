import { Readable, Writable } from 'node:stream'
import { jest } from '@jest/globals'

export class TestUtil {
  static defautlHandleParams () {
    const requestStream = TestUtil.generateReadableStream(['fake request body'])
    const response = TestUtil.generateWritableStream(() => { })
    const data = {
      request: Object.assign(requestStream, {
        headers: {},
        method: '',
        url: ''
      }),
      response: Object.assign(response, {
        writeHead: jest.fn(),
        end: jest.fn()
      })
    }
    return {
      values: () => Object.values(data),
      ...data
    }
  }

  static generateReadableStream (data) {
    return new Readable({
      read () {
        for (const item of data) {
          this.push(item)
        }
        this.push(null)
      }
    })
  }

  static generateWritableStream (onData) {
    return new Writable({
      write (chunk, encode, callback) {
        onData(chunk)
        callback(null, chunk)
      }
    })
  }
}
