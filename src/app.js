import express from 'express';
import cors from 'cors';
import serverMiddlewareError from './middlewares/serverMiddlewareError.js';
import * as recommendationController from './controllers/recommendationController.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/recommendations', recommendationController.addNewRecommendation);
app.post('/recommendations/:id/upvote', recommendationController.upvoteRecommendation);
app.post('/recommendations/:id/downvote', recommendationController.downvoteRecommendation);
app.get('/recommendations/random', recommendationController.obtainRandomRecommendations);
app.get('/recommendations/top/:amount', recommendationController.obtainTopRecommendations);

app.use(serverMiddlewareError);

export default app;
