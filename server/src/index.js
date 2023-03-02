import { server } from './server.js'
import { logger } from './util/logger.js'
import config from './config.js'

const PORT = 3333 || process.env.PORT

logger.info(config)

server.listen(PORT)
  .on('listening', () => logger.info(`Server running on http://localhost:${PORT}`))
