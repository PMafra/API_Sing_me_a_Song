/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import * as recommendationService from '../services/recommendationService.js';

async function addRecommendation(req, res) {
  try {
    return res.sendStatus(201);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
}

export {
  addRecommendation,
};
