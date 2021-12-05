/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import { logger } from '../../utils/logger.js';
import RequestError from '../errors/requestError.js';
import NotFoundError from '../errors/notFoundError.js';

const serverMiddlewareError = async (err, req, res, next) => {
  let logErrorMessage = `method: ${req.method} - url: ${req.originalUrl} - ip: ${req.ip} - message: ${err.message}`;
  if (err instanceof RequestError) {
    logErrorMessage += ' - status: 400';
    logger.error(logErrorMessage);
    return res.status(400).send(err.message);
  }
  if (err instanceof NotFoundError) {
    logErrorMessage += ' - status: 404';
    logger.error(logErrorMessage);
    return res.sendStatus(404);
  }
  logErrorMessage += ' - status: 500';
  logger.error(logErrorMessage);
  return res.sendStatus(500);
};

export default serverMiddlewareError;
