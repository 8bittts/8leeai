/**
 * Test setup for Bun test runner with React Testing Library
 * Configures happy-dom as the DOM environment
 */
import "@testing-library/jest-dom"
import { Window } from "happy-dom"

// Create and setup happy-dom window
const window = new Window()
const document = window.document

// Set global variables
global.window = window as unknown as Window & typeof globalThis
global.document = document
global.HTMLElement = window.HTMLElement
global.navigator = window.navigator

// Add requestAnimationFrame polyfill for tests
global.requestAnimationFrame = (callback: FrameRequestCallback) => {
  return setTimeout(callback, 16) as unknown as number
}

global.cancelAnimationFrame = (id: number) => {
  clearTimeout(id)
}

// Add matchMedia polyfill for tests (default to desktop)
global.matchMedia = ((query: string) => ({
  matches: false, // Default to desktop (not touch)
  media: query,
  onchange: null,
  addListener: () => {
    /* stub */
  },
  removeListener: () => {
    /* stub */
  },
  addEventListener: () => {
    /* stub */
  },
  removeEventListener: () => {
    /* stub */
  },
  dispatchEvent: () => true,
})) as typeof window.matchMedia
