import { beforeEach, describe, expect, it, jest, } from '@jest/globals'

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
  it.todo(`GET /home - should response with ${config.pages.homeHTML} file stream`)
  it.todo(`GET /controller - should response with ${config.pages.controllerHTML} file stream`)
  it.todo(`GET /file.ext - should response with file stream`)
  it.todo(`GET /404 - given an inexistent route it should response with 404`)

  describe('#Exceptions', () => {
    it.todo('given inexistent file it should respond with 404')
    it.todo('given an error it should respond with 500')
  })
})
