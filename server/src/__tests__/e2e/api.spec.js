import { Transform } from 'node:stream'
import { setTimeout } from 'node:timers/promises'
import { beforeEach, describe, expect, it, jest, } from '@jest/globals'
import superTest from 'supertest'
import portfinder from 'portfinder'

import { server } from './../../server.js'
import config from './../../config.js'

const getAvailablePort = portfinder.getPortPromise
const RETENTION_DATA_PERIOD = 200

describe('#API E2E Suite Test', () => {
  const COMMAND_RESPONSE = JSON.stringify({ result: 'ok' })
  const possibleCommands = {
    start: 'start',
    stop: 'stop'
  }

  const pipeAndReadStreamData = (stream, onChunk) => {
    const transform = new Transform({
      transform (chunk, encode, callback) {
        onChunk(chunk)
        callback(null, chunk)
      }
    })
    return stream.pipe(transform)
  }

  describe('client workflow', () => {
    const getTestServer = async () => {
      const getSuperTest = port => superTest(`http://localhost:${port}`)
      const port = await getAvailablePort()
      return new Promise((resolve, reject) => {
        const serverResult = server.listen(port)
          .once('listening', () => {
            const testServer = getSuperTest(port)
            const response = {
              testServer,
              kill () {
                serverResult.close()
              }
            }
            return resolve(response)
          })
          .once('error', reject)
      })
    }

    const commandSender = async (testServer) => {
      return {
        async send (command) {
          const response = await testServer.post('/controller')
            .send({
              command
            })

          expect(response.text).toStrictEqual(COMMAND_RESPONSE)
        }
      }
    }

    it('should not receive data stream if the process is not playing', async () => {
      const server = await getTestServer()
      const onChunk = jest.fn()
      pipeAndReadStreamData(
        server.testServer.get('/stream'),
        onChunk
      )
      await setTimeout(RETENTION_DATA_PERIOD)
      server.kill()

      expect(onChunk).not.toHaveBeenCalled()
    })
    it('should receive data stream if the process is playing', async () => {
      const server = await getTestServer()
      const onChunk = jest.fn()
      const { send } = await commandSender(server.testServer)
      pipeAndReadStreamData(
        server.testServer.get('/stream'),
        onChunk
      )
      await send(possibleCommands.start)
      await setTimeout(RETENTION_DATA_PERIOD)
      // await send(possibleCommands.stop)
      const [[buffer]] = onChunk.mock.calls

      expect(buffer).toBeInstanceOf(Buffer)
      expect(buffer.length).toBeGreaterThan(1000)

      server.kill()

    })
  })
})
