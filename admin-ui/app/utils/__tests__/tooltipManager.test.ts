import { tooltipManager } from '../tooltipManager'

const makeAnchor = (id: string): HTMLElement => {
  const el = document.createElement('div')
  el.setAttribute('data-tooltip-id', id)
  document.body.appendChild(el)
  return el
}

type TooltipCallback = (anchor: Element | null) => void

// Track registrations so afterEach can dispose them even if an expectation
// throws first — otherwise leaked callbacks survive in the module-level
// registry and could fire during later tests.
const disposers: Array<() => void> = []

const addListener = (id: string, cb: TooltipCallback) => {
  tooltipManager.addListener(id, cb)
  disposers.push(() => tooltipManager.removeListener(id, cb))
}

describe('tooltipManager', () => {
  afterEach(() => {
    disposers.splice(0).forEach((dispose) => dispose())
    document.body.innerHTML = ''
  })

  it('notifies a registered listener with the anchor on mouseover', () => {
    const anchor = makeAnchor('tip-1')
    const cb = jest.fn()
    addListener('tip-1', cb)

    anchor.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
    expect(cb).toHaveBeenCalledWith(anchor)
  })

  it('notifies with null on mouseout', () => {
    const anchor = makeAnchor('tip-2')
    const cb = jest.fn()
    addListener('tip-2', cb)

    anchor.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }))
    expect(cb).toHaveBeenCalledWith(null)
  })

  it('responds to focusin and focusout events', () => {
    const anchor = makeAnchor('tip-3')
    const cb = jest.fn()
    addListener('tip-3', cb)

    anchor.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    expect(cb).toHaveBeenLastCalledWith(anchor)
    anchor.dispatchEvent(new FocusEvent('focusout', { bubbles: true }))
    expect(cb).toHaveBeenLastCalledWith(null)
  })

  it('only notifies listeners registered for the matching tooltip id', () => {
    const anchorA = makeAnchor('id-a')
    const cbA = jest.fn()
    const cbB = jest.fn()
    addListener('id-a', cbA)
    addListener('id-b', cbB)

    anchorA.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
    expect(cbA).toHaveBeenCalledWith(anchorA)
    expect(cbB).not.toHaveBeenCalled()
  })

  it('supports multiple listeners on the same id', () => {
    const anchor = makeAnchor('shared')
    const cb1 = jest.fn()
    const cb2 = jest.fn()
    addListener('shared', cb1)
    addListener('shared', cb2)

    anchor.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
    expect(cb1).toHaveBeenCalledWith(anchor)
    expect(cb2).toHaveBeenCalledWith(anchor)
  })

  it('stops notifying after the listener is removed', () => {
    const anchor = makeAnchor('tip-4')
    const cb = jest.fn()
    tooltipManager.addListener('tip-4', cb)
    tooltipManager.removeListener('tip-4', cb)

    anchor.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
    expect(cb).not.toHaveBeenCalled()
  })

  it('does not notify when the target has no tooltip anchor', () => {
    const cb = jest.fn()
    addListener('tip-5', cb)
    const plain = document.createElement('span')
    document.body.appendChild(plain)

    plain.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
    expect(cb).not.toHaveBeenCalled()
  })
})
