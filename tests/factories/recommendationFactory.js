/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-plusplus */
/* eslint-disable import/prefer-default-export */
import faker from 'faker';

const createRecomendations = ({ length, score, isBody }) => {
  if (isBody) {
    return {
      name: `${faker.name.findName()} - ${faker.name.findName()}`,
      youtubeLink: 'https://www.youtube.com/watch?',
    };
  }

  if (score && length === 1) {
    return {
      id: 1,
      name: `${faker.name.findName()} - ${faker.name.findName()}`,
      youtubeLink: 'https://www.youtube.com/watch?',
      score,
    };
  }

  const recommendationList = [];
  for (let i = 1; i <= length; i++) {
    recommendationList.push({
      id: i,
      name: `${faker.name.findName()} - ${faker.name.findName()}`,
      youtubeLink: 'https://www.youtube.com/watch?',
      score: length * 2 - i,
    });
  }

  return recommendationList;
};

export {
  createRecomendations,
};
