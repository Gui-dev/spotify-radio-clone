import { beforeEach, describe, expect, it, jest, } from '@jest/globals'
import { JSDOM } from 'jsdom'

import { View } from './../controller/src/view.js'

describe('#View - test suite for presentation layer ', () => {
  const dom = new JSDOM()
  global.document = dom.window.document
  global.window = dom.window

  function makeBtnElement ({
    text,
    classList
  } = {
      text: '',
      classList: {
        add: jest.fn(),
        remove: jest.fn(),
      }
    }) {
    return {
      onclick: jest.fn(),
      classList,
      innerText: text
    }
  }

  beforeEach(() => {
    jest.resetAllMocks()
    jest.clearAllMocks()
    jest.spyOn(
      document,
      "getElementById"
    ).mockReturnValue(makeBtnElement())
  })

  it('#changeCommandBtnsVisibility - given hide=true it should add unassigned class and reset onclick', () => {
    const view = new View()
    const btn = makeBtnElement()
    jest.spyOn(
      document,
      "querySelectorAll"
    ).mockReturnValue([btn])

    view.changeCommandButtonsVisibility()

    expect(btn.classList.add).toHaveBeenCalledWith('unassigned')
    expect(btn.onclick.name).toStrictEqual('onClickReset')
    expect(() => btn.onclick()).not.toThrow()

  })
  it.todo('#changeCommandButtonsVisibility - given hide=false it should remove unassigned class and reset onclick')
  it.todo('#onLoad - given hide=true it should add unassigned class and reset onclick')
})
