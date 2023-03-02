import { createServer } from 'node:http'

import { handler } from './routes.js'

export const server = createServer(handler)
