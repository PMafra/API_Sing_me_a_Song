/* eslint-disable no-unused-vars */
import * as recommendationService from '../services/recommendationService.js';
import RequestError from '../errors/requestError.js';
import NotFoundError from '../errors/notFoundError.js';

const addNewRecommendation = async (req, res, next) => {
  try {
    await recommendationService.validateRecommendationBody(req.body);

    const { name, youtubeLink } = req.body;

    const addNewSong = await recommendationService.insertRecommendation({ name, youtubeLink });

    if (addNewSong === 'addedPoint') {
      return res.status(201).send('This recommendation already exists. A score point has been added to it.');
    }
    return res.sendStatus(201);
  } catch (err) {
    if (err instanceof RequestError) {
      return res.status(400).send(err.message);
    }
    return next(err);
  }
};

const upvoteRecommendation = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!Number(id)) {
      return res.sendStatus(400);
    }

    await recommendationService.increaseScore({ id });

    return res.sendStatus(201);
  } catch (err) {
    if (err instanceof NotFoundError) {
      return res.sendStatus(404);
    }
    return next(err);
  }
};

const downvoteRecommendation = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!Number(id)) {
      return res.sendStatus(400);
    }

    const decrease = await recommendationService.decreaseScore({ id });

    if (decrease === 'deleted') {
      return res.status(201).send('Recommendation deleted');
    }

    return res.sendStatus(201);
  } catch (err) {
    if (err instanceof NotFoundError) {
      return res.sendStatus(404);
    }
    return next(err);
  }
};

const obtainRandomRecommendations = async (req, res, next) => {
  try {
    const randomRecommendations = await recommendationService.getRandomRecommendations();

    return res.send(randomRecommendations);
  } catch (err) {
    if (err instanceof NotFoundError) {
      return res.sendStatus(404);
    }
    return next(err);
  }
};

const obtainTopRecommendations = async (req, res, next) => {
  try {
    const { amount } = req.params;

    if (!Number(amount)) {
      return res.sendStatus(400);
    }

    const topRecommendations = await recommendationService.getTopRecommendations({ amount });

    return res.send(topRecommendations);
  } catch (err) {
    if (err instanceof NotFoundError) {
      return res.sendStatus(404);
    }
    return next(err);
  }
};

export {
  addNewRecommendation,
  upvoteRecommendation,
  downvoteRecommendation,
  obtainRandomRecommendations,
  obtainTopRecommendations,
};
