/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const serverMiddlewareError = async (err, req, res, next) => {
  console.log(err);
  res.sendStatus(500);
};

export default serverMiddlewareError;
