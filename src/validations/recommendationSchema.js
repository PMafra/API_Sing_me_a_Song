/* eslint-disable no-useless-escape */
import Joi from 'joi';

const recommendationSchema = Joi.object().length(2).keys({
  name: Joi.string().min(1).max(255).required(),
  youtubeLink: Joi.string().required(),
});

export default recommendationSchema;
