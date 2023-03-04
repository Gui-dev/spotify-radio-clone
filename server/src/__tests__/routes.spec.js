import { beforeEach, describe, expect, it, jest, } from '@jest/globals'

import { Controller } from './../controller'
import { TestUtil } from './_util/test-util.js'
import { handler } from './../routes'
import config from './../config.js'

describe('#Routes - test site for api response', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  it('GET / - should redirect to home page', async () => {
    const params = TestUtil.defautlHandleParams()
    params.request.method = 'GET'
    params.request.url = '/'
    await handler(...params.values())

    expect(params.response.writeHead).toHaveBeenCalledWith(302, {
      'Location': config.location.home
    })
    expect(params.response.end).toHaveBeenCalled()
  })
  it(`GET /home - should response with ${config.pages.homeHTML} file stream`, async () => {
    const params = TestUtil.defautlHandleParams()
    params.request.method = 'GET'
    params.request.url = '/home'
    const mockFileStream = TestUtil.generateReadableStream(['fake data'])
    jest.spyOn(
      Controller.prototype,
      Controller.prototype.getFileStream.name
    ).mockResolvedValue({
      stream: mockFileStream
    })
    jest.spyOn(
      mockFileStream,
      'pipe'
    ).mockReturnValue()
    await handler(...params.values())

    expect(Controller.prototype.getFileStream).toHaveBeenCalledWith(
      config.pages.homeHTML
    )
    expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response)
  })
  it(`GET /controller - should response with ${config.pages.controllerHTML} file stream`, async () => {
    const params = TestUtil.defautlHandleParams()
    params.request.method = 'GET'
    params.request.url = '/controller'
    const mockFileStream = TestUtil.generateReadableStream(['fake data'])
    jest.spyOn(
      Controller.prototype,
      Controller.prototype.getFileStream.name
    ).mockResolvedValue({
      stream: mockFileStream
    })
    jest.spyOn(
      mockFileStream,
      'pipe'
    ).mockReturnValue()
    await handler(...params.values())

    expect(Controller.prototype.getFileStream).toHaveBeenCalledWith(
      config.pages.controllerHTML
    )
    expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response)
  })
  it.todo(`GET /file.ext - should response with file stream`)
  it.todo(`GET /404 - given an inexistent route it should response with 404`)

  describe('#Exceptions', () => {
    it.todo('given inexistent file it should respond with 404')
    it.todo('given an error it should respond with 500')
  })
})
