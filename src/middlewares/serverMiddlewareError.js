/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import { logger } from '../../utils/logger.js';

const serverMiddlewareError = async (err, req, res, next) => {
  logger.error(err);
  res.sendStatus(500);
};

export default serverMiddlewareError;
