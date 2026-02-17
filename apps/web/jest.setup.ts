import '@testing-library/jest-dom'

// jsdom doesn't implement window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true,
})
