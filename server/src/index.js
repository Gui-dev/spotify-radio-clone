import { server } from './server.js'
import { logger } from './util/logger.js'

const PORT = 3333 || process.env.PORT

server.listen(PORT)
  .on('listening', () => logger.info(`Server running on http://localhost:${PORT}`))
