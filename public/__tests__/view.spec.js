import { beforeEach, describe, expect, it, jest, } from '@jest/globals'
import { JSDOM } from 'jsdom'

import { View } from './../controller/src/view.js'

describe('#View - test suite for presentation layer', () => {
  const dom = new JSDOM()
  global.document = dom.window.document
  global.window = dom.window

  const makeButtonElement = (
    { text, classList } =
      {
        test: '',
        classList: {
          add: jest.fn(),
          remove: jest.fn()
        }
      }
  ) => {
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
      document.getElementById.name
    ).mockReturnValue([makeButtonElement()])
  })

  it('#changeCommandButtonsVisibility - given hide=true it should add unassigned class and reset onclick', async () => {
    const view = new View()
    const button = makeButtonElement()
    jest.spyOn(
      document,
      document.querySelectorAll.name
    ).mockReturnValue([button])
    view.changeCommandButtonsVisibility()

    expect(button.classList.add).toHaveBeenCalledWith('unassigned')
  })
  it.todo('#changeCommandButtonsVisibility - given hide=false it should remove unassigned class and reset onclick')
  it.todo('#onLoad - given hide=true it should add unassigned class and reset onclick')
})
