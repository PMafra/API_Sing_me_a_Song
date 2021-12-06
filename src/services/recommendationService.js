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
  const isValidNameString = objectBody.name.split(' - ');
  if (isValidNameString.length !== 2) {
    throw new RequestError('Recommendation name malformed');
  }
  if (isValidNameString[0].length === 0 || isValidNameString[1].length === 0) {
    throw new RequestError('Missing song or singer name');
  }
  await validateUrl(objectBody.youtubeLink)
    .then(() => true).catch((err) => {
      throw new RequestError(err);
    });

  return true;
};

const insertRecommendation = async ({ name, youtubeLink }) => {
  const removingBlanck = name.split('-');
  const removeFirst = removingBlanck[0].trim();
  const removeSecond = removingBlanck[1].trim();
  const newName = `${removeFirst} - ${removeSecond}`;

  const isAlreadyRecommended = await recommendationRepository.selectQuery({ name: newName });

  if (isAlreadyRecommended) {
    await recommendationRepository.updateScore({ id: isAlreadyRecommended.id, type: 'upvote' });
    return 'addedPoint';
  }

  await recommendationRepository.insertRecommendation({ name: newName, youtubeLink });
  return true;
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
  let randomness;
  let notAllLessThan10;
  const allRecommendations = await recommendationRepository.selectQuery({});
  if (allRecommendations.length === 0) {
    throw new NotFoundError();
  }
  const notAllGreaterThan10 = allRecommendations.find((song) => song.score <= 10);

  if (notAllGreaterThan10) {
    notAllLessThan10 = allRecommendations.find((song) => song.score > 10);
  }

  if (notAllLessThan10) {
    const randomNumber = Math.random();
    if (randomNumber < 0.7) {
      randomness = 70;
    }
    if (randomNumber >= 0.7) {
      randomness = 30;
    }
  }

  const recommendations = await recommendationRepository.selectQuery({ randomness });
  return recommendations;
};

const getTopRecommendations = async ({ amount }) => {
  const topRecommendations = await recommendationRepository.selectQuery({ amount });

  if (topRecommendations.length === 0) {
    throw new NotFoundError();
  }

  return topRecommendations;
};

export {
  insertRecommendation,
  validateRecommendationBody,
  increaseScore,
  decreaseScore,
  getRandomRecommendations,
  getTopRecommendations,
};
