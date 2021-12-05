/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import { logger } from '../../utils/logger.js';

const serverMiddlewareError = async (err, req, res, next) => {
  res.sendStatus(500);
  logger.error(`method: ${req.method} - url: ${req.originalUrl} - status: ${res.statusCode} - message: ${err.message} - ip: ${req.ip}`);
};

export default serverMiddlewareError;
