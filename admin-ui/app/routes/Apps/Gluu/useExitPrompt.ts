import { useState, useEffect } from 'react'

const initBeforeUnLoad = (showExitPrompt: any) => {
  window.onbeforeunload = (event) => {
    if (showExitPrompt) {
      const e = event || window.event
      e.preventDefault()
      if (e) {
        e.returnValue = ''
      }
      return ''
    }
  }
}

// Hook
export default function useExitPrompt(bool: any) {
  const [showExitPrompt, setShowExitPrompt] = useState(bool)

  window.onload = function () {
    initBeforeUnLoad(showExitPrompt)
  }

  useEffect(() => {
    initBeforeUnLoad(showExitPrompt)
  }, [showExitPrompt])

  return [showExitPrompt, setShowExitPrompt]
}
