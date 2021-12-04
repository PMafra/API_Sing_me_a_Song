/* eslint-disable import/no-extraneous-dependencies */
import faker from 'faker';

const createRecomendations = ({ length, score, isBody }) => {
  const youtubeLink = 'https://www.youtube.com/watch?';
  const baseObject = {
    name: `${faker.name.findName()} - ${faker.name.findName()}`,
    youtubeLink,
  };

  if (isBody) {
    return baseObject;
  }

  if (score && length === 1) {
    baseObject.id = 1;
    baseObject.score = score;
    return baseObject;
  }

  const recommendationList = [];
  for (let i = 1; i <= length; i++) {
    recommendationList.push({
      id: i,
      name: `${faker.name.findName()} - ${faker.name.findName()}`,
      youtubeLink,
      score: length * 2 - i,
    });
  }

  return recommendationList;
};

export {
  createRecomendations,
};
