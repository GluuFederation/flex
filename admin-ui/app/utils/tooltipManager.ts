type TooltipCallback = (anchor: Element | null) => void

const registry = new Map<string, Set<TooltipCallback>>()
let listening = false

const resolveAnchor = (target: EventTarget | null): Element | null =>
  target instanceof Element ? target.closest('[data-tooltip-id]') : null

const notify = (target: EventTarget | null, show: boolean) => {
  const el = resolveAnchor(target)
  const docEntry = el?.getAttribute('data-tooltip-id')
  if (!docEntry) return
  registry.get(docEntry)?.forEach((callback) => callback(show ? el : null))
}

const handleShow = (event: Event) => notify(event.target, true)
const handleHide = (event: Event) => notify(event.target, false)

const startListening = () => {
  if (listening) return
  listening = true
  document.addEventListener('mouseover', handleShow)
  document.addEventListener('mouseout', handleHide)
  document.addEventListener('focusin', handleShow)
  document.addEventListener('focusout', handleHide)
}

const stopListening = () => {
  if (!listening) return
  listening = false
  document.removeEventListener('mouseover', handleShow)
  document.removeEventListener('mouseout', handleHide)
  document.removeEventListener('focusin', handleShow)
  document.removeEventListener('focusout', handleHide)
}

const addListener = (docEntry: string, callback: TooltipCallback) => {
  const callbacks = registry.get(docEntry) ?? new Set<TooltipCallback>()
  callbacks.add(callback)
  registry.set(docEntry, callbacks)
  startListening()
}

const removeListener = (docEntry: string, callback: TooltipCallback) => {
  const callbacks = registry.get(docEntry)
  if (!callbacks) return
  callbacks.delete(callback)
  if (callbacks.size === 0) registry.delete(docEntry)
  if (registry.size === 0) stopListening()
}

export const tooltipManager = { addListener, removeListener }
