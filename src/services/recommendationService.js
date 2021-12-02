/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import { validateUrl } from 'youtube-validate';
import * as recommendationRepository from '../repositories/recommendationRepository.js';
import recommendationSchema from '../validations/recommendationSchema.js';
import RequestError from '../errors/requestError.js';

const validateRecommendationBody = async (objectBody) => {
  const isCorrectBody = recommendationSchema.validate(objectBody);
  if (isCorrectBody.error) {
    throw new RequestError(isCorrectBody.error.details[0].message);
  }
  console.log(objectBody.youtubeLink);
  await validateUrl(objectBody.youtubeLink)
    .then(() => true).catch((err) => {
      throw new RequestError(err);
    });
};

const insertRecommendation = async ({ name, link }) => {
  const isAlreadyRecommended = await recommendationRepository.selectRecommendation({ name });

  if (isAlreadyRecommended) {
    await recommendationRepository.updateScore({ name, type: 'upvote' });
    return 'addedPoint';
  }

  return recommendationRepository.insertRecommendation({ name, link });
};

export {
  insertRecommendation,
  validateRecommendationBody,
};
