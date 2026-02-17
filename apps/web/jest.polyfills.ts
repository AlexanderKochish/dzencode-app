/* eslint-disable @typescript-eslint/no-require-imports */
// jest.polyfills.ts — Required for MSW v2 in jsdom environment
// jsdom strips away Node.js fetch globals, but MSW v2 needs them

import { TextDecoder, TextEncoder } from 'node:util'
import {
  ReadableStream,
  TransformStream,
  WritableStream,
} from 'node:stream/web'

// BroadcastChannel polyfill for MSW WebSocket support
class BroadcastChannelPolyfill {
  name: string
  onmessage: ((ev: MessageEvent) => void) | null = null
  constructor(name: string) { this.name = name }
  postMessage() {}
  close() {}
  addEventListener() {}
  removeEventListener() {}
  dispatchEvent() { return true }
}

Object.defineProperties(globalThis, {
  TextDecoder: { value: TextDecoder },
  TextEncoder: { value: TextEncoder },
  ReadableStream: { value: ReadableStream },
  TransformStream: { value: TransformStream },
  WritableStream: { value: WritableStream },
  BroadcastChannel: { value: BroadcastChannelPolyfill },
})

const { Blob, File } = require('node:buffer')
const { fetch, Headers, FormData, Request, Response } = require('undici')

Object.defineProperties(globalThis, {
  fetch: { value: fetch, writable: true },
  Blob: { value: Blob },
  File: { value: File },
  Headers: { value: Headers },
  FormData: { value: FormData },
  Request: { value: Request },
  Response: { value: Response },
})
