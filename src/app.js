import express from 'express';
import cors from 'cors';
import * as recommendationController from './controllers/recommendationController.js';
import serverMiddlewareError from './middlewares/serverMiddlewareError.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/recommendations', recommendationController.addNewRecommendation);

app.use(serverMiddlewareError);

export default app;
