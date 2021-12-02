/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import * as recommendationService from '../services/recommendationService.js';
import RequestError from '../errors/requestError.js';
import NotFoundError from '../errors/notFoundError.js';

const addNewRecommendation = async (req, res, next) => {
  try {
    await recommendationService.validateRecommendationBody(req.body);

    const { name, youtubeLink: link } = req.body;

    const addNewSong = await recommendationService.insertRecommendation({ name, link });

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

export {
  addNewRecommendation,
  upvoteRecommendation,
};
