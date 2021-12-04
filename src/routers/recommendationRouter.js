import { Router } from 'express';
import * as recommendationController from '../controllers/recommendationController.js';

const router = new Router();

router.post('', recommendationController.addNewRecommendation);
router.post('/:id/upvote', recommendationController.upvoteRecommendation);
router.post('/:id/downvote', recommendationController.downvoteRecommendation);
router.get('/random', recommendationController.obtainRandomRecommendations);
router.get('/top/:amount', recommendationController.obtainTopRecommendations);

export default router;
