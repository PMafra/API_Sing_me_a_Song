/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import * as recommendationService from '../services/recommendationService.js';

const addNewRecommendation = async (req, res, next) => {
  const { name, youtubeLink: link } = req.body;

  try {
    await recommendationService.insertRecommendation({ name, link });

    return res.sendStatus(201);
  } catch (err) {
    console.log(err);
    return next();
  }
};

export {
  addNewRecommendation,
};
