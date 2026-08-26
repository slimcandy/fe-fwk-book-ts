export type EventHandlers = {
  [K in keyof HTMLElementEventMap]?: (event: HTMLElementEventMap[K]) => void
}

/**
 * Adds event listeners to an event target and returns an object containing
 * the added listeners.
 */
export function addEventListeners(
  listeners: EventHandlers = {},
  el: EventTarget
): EventHandlers {
  const addedListeners: EventHandlers = {}
  const entries = Object.entries(listeners) as [
    keyof HTMLElementEventMap,
    EventListener
  ][]

  entries.forEach(([eventName, handler]) => {
    const listener = addEventListener(eventName, handler, el)
    addedListeners[eventName] = listener
  })

  return addedListeners
}

/**
 * Adds an event listener to an event target and returns the listener.
 */
export function addEventListener(
  eventName: keyof HTMLElementEventMap,
  handler: EventListener,
  el: EventTarget
): EventListener {
  el.addEventListener(eventName, handler)
  return handler
}

/**
 * Removes the event listeners from an event target.
 */
export function removeEventListeners(
  listeners: EventHandlers = {},
  el: EventTarget
) {
  const entries = Object.entries(listeners) as [
    keyof HTMLElementEventMap,
    EventListener
  ][]

  entries.forEach(([eventName, handler]) => {
    el.removeEventListener(eventName, handler)
  })
}
