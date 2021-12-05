import express from 'express';
import cors from 'cors';
import serverMiddlewareError from './middlewares/serverMiddlewareError.js';
import recommendationRouter from './routers/recommendationRouter.js';
import logMiddlewareInfo from './middlewares/loggerMiddlewareInfo.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use(logMiddlewareInfo);
app.use('/recommendations', recommendationRouter);
app.use(serverMiddlewareError);

export default app;
