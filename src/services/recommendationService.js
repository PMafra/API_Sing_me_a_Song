/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import * as recommendationRepository from '../repositories/recommendationRepository.js';

const insertRecommendation = async ({ name, link }) => {
  const isAlreadyRecommended = await recommendationRepository.selectRecommendation({ name });

  if (isAlreadyRecommended) {
    return console.log('Add point to score');
  }

  return recommendationRepository.insertRecommendation({ name, link });
};

export {
  insertRecommendation,
};
