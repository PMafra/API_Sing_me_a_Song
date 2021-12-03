/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import { validateUrl } from 'youtube-validate';
import * as recommendationRepository from '../repositories/recommendationRepository.js';
import recommendationSchema from '../validations/recommendationSchema.js';
import RequestError from '../errors/requestError.js';
import NotFoundError from '../errors/notFoundError.js';

const validateRecommendationBody = async (objectBody) => {
  const isCorrectBody = recommendationSchema.validate(objectBody);
  if (isCorrectBody.error) {
    throw new RequestError(isCorrectBody.error.details[0].message);
  }

  await validateUrl(objectBody.youtubeLink)
    .then(() => true).catch((err) => {
      throw new RequestError(err);
    });
};

const insertRecommendation = async ({ name, link }) => {
  const isAlreadyRecommended = await recommendationRepository.selectRecommendation({ name });

  if (isAlreadyRecommended) {
    await recommendationRepository.updateScore({ id: isAlreadyRecommended.id, type: 'upvote' });
    return 'addedPoint';
  }

  return recommendationRepository.insertRecommendation({ name, link });
};

const increaseScore = async ({ id }) => {
  const upvote = await recommendationRepository.updateScore({ id, type: 'upvote' });
  if (!upvote) {
    throw new NotFoundError();
  }
  return true;
};

const decreaseScore = async ({ id }) => {
  const downvote = await recommendationRepository.updateScore({ id, type: 'downvote' });
  if (!downvote) {
    throw new NotFoundError();
  }
  if (downvote.score < -5) {
    await recommendationRepository.deleteRecommendation({ id });
    return 'deleted';
  }

  return true;
};

const getRandomRecommendations = async () => {
  const randomNumber = Math.random();
  let filter;

  if (randomNumber < 0.7) {
    filter = 70;
  }
  if (randomNumber >= 0.7) {
    filter = 30;
  }

  const recommendations = await recommendationRepository.selectRandom({ filter });

  return recommendations;
};

export {
  insertRecommendation,
  validateRecommendationBody,
  increaseScore,
  decreaseScore,
  getRandomRecommendations,
};
