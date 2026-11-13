import { useEffect, useRef } from 'react'

const isTypingTarget = (target) => {
  if (!target) return false
  const tag = target.tagName
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    tag === 'BUTTON' ||
    tag === 'A' ||
    target.isContentEditable === true
  )
}

/**
 * `bindings` maps a lowercase key (" ", "l", "r"...) to a handler.
 * Handlers are kept in a ref so the listener never needs to re-bind.
 */
export function useKeyboardShortcuts(bindings, { enabled = true } = {}) {
  const bindingsRef = useRef(bindings)
  bindingsRef.current = bindings

  useEffect(() => {
    if (!enabled) return undefined

    const onKeyDown = (event) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return
      if (isTypingTarget(event.target)) return
      if (document.querySelector('[data-modal-open="true"]')) return

      const key =
        event.key === 'Spacebar' ? ' ' : event.key === '?' ? '?' : event.key.toLowerCase()
      const handler = bindingsRef.current[key]
      if (!handler) return

      if (key === ' ' || key === '?') event.preventDefault()
      if (event.repeat) return
      handler(event)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [enabled])
}
