import { useEffect, useReducer, useRef } from "react"
import { ANIMATION_DELAYS } from "@/lib/utils"

interface UseTypewriterOptions {
  text: string
  speed?: number
  onComplete?: () => void
  respectReducedMotion?: boolean
}

interface TypewriterState {
  displayedText: string
  isTyping: boolean
}

type TypewriterAction =
  | { type: "reset" }
  | { type: "tick"; text: string }
  | { type: "complete" }
  | { type: "instant"; text: string }

const INITIAL_STATE: TypewriterState = { displayedText: "", isTyping: true }

function reducer(state: TypewriterState, action: TypewriterAction): TypewriterState {
  switch (action.type) {
    case "reset":
      return INITIAL_STATE
    case "tick":
      return { displayedText: action.text, isTyping: true }
    case "complete":
      return { ...state, isTyping: false }
    case "instant":
      return { displayedText: action.text, isTyping: false }
    default:
      return state
  }
}

export function useTypewriter({
  text,
  speed = ANIMATION_DELAYS.typewriter,
  onComplete,
  respectReducedMotion = true,
}: UseTypewriterOptions) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  })

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (respectReducedMotion && prefersReducedMotion) {
      dispatch({ type: "instant", text })
      onCompleteRef.current?.()
      return
    }

    dispatch({ type: "reset" })

    let currentIndex = 0
    intervalRef.current = setInterval(() => {
      if (currentIndex < text.length) {
        currentIndex++
        dispatch({ type: "tick", text: text.slice(0, currentIndex) })
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
        dispatch({ type: "complete" })
        onCompleteRef.current?.()
      }
    }, speed)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [text, speed, respectReducedMotion])

  return { displayedText: state.displayedText, isTyping: state.isTyping }
}
