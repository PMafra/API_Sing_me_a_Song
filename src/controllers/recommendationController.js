/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import * as recommendationService from '../services/recommendationService.js';

const addNewRecommendation = async (req, res, next) => {
  const { name, youtubeLink: link } = req.body;

  try {
    const addNewSong = await recommendationService.insertRecommendation({ name, link });

    if (addNewSong === 'addedPoint') {
      return res.status(201).send('This recommendation already exists. A score point has been added to it.');
    }
    return res.sendStatus(201);
  } catch (err) {
    console.log(err);
    return next();
  }
};

export {
  addNewRecommendation,
};
