/* eslint-disable @typescript-eslint/no-require-imports */
// jest.polyfills.ts — Required for MSW v2 in jsdom environment
// jsdom strips away Node.js fetch globals, but MSW v2 needs them

import { TextDecoder, TextEncoder } from 'node:util'
import { ReadableStream, TransformStream } from 'node:stream/web'

Object.defineProperties(globalThis, {
  TextDecoder: { value: TextDecoder },
  TextEncoder: { value: TextEncoder },
  ReadableStream: { value: ReadableStream },
  TransformStream: { value: TransformStream },
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
