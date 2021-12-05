import recommendationSchema from '../../src/validations/recommendationSchema.js';
import * as recommendationRepository from '../../src/repositories/recommendationRepository.js';

const mockValidate = jest.spyOn(recommendationSchema, 'validate');
const mockUpdate = jest.spyOn(recommendationRepository, 'updateScore');
const mockDelete = jest.spyOn(recommendationRepository, 'deleteRecommendation');
const mockSelect = jest.spyOn(recommendationRepository, 'selectQuery');
const mockInsert = jest.spyOn(recommendationRepository, 'insertRecommendation');

const mockRecommendationRepository = {
  validate: (valueToBeReturned) => mockValidate.mockImplementationOnce(() => valueToBeReturned),
  updateScore: (valueToBeReturned) => mockUpdate.mockImplementationOnce(() => valueToBeReturned),
  deleteRecommendation: (valueToBeReturned) => mockDelete.mockImplementationOnce(() => (
    valueToBeReturned
  )),
  selectQuery: (valueToBeReturned) => mockSelect.mockImplementationOnce(() => (
    valueToBeReturned
  )),
  insertRecommendation: (valueToBeReturned) => mockInsert.mockImplementationOnce(() => (
    valueToBeReturned
  )),
};

export {
  mockRecommendationRepository,
};
