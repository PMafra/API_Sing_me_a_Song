import * as recommendationFactory from '../../factories/recommendationFactory.js';
import * as recommendationService from '../../../src/services/recommendationService.js';
import * as recommendationRepository from '../../../src/repositories/recommendationRepository.js';

const sut = recommendationService;

const mockRecommendationBody = recommendationFactory.createRecomendations(
  { length: null, score: null, isBody: true },
);
const mockRecommendation = recommendationFactory.createRecomendations({
  length: 1, score: 1, isBody: false,
});
const mockSelect = jest.spyOn(recommendationRepository, 'selectQuery');
const mockUpdate = jest.spyOn(recommendationRepository, 'updateScore');
const mockInsert = jest.spyOn(recommendationRepository, 'insertRecommendation');

const mockRecommendationRepository = {
  selectQuery: {
    undefined: () => mockSelect.mockImplementationOnce(() => undefined),
    recommendation: () => mockSelect.mockImplementationOnce(() => mockRecommendation),
  },
  updateScore: {
    true: () => mockUpdate.mockImplementationOnce(() => true),
  },
  insertRecommendation: {
    true: () => mockInsert.mockImplementationOnce(() => true),
  },
};

describe('Insert recommendation service tests', () => {
  it('Should return "addedPoint" when recommendation already exists', async () => {
    mockRecommendationRepository.selectQuery.recommendation();
    mockRecommendationRepository.updateScore.true();

    const result = await sut.insertRecommendation(mockRecommendationBody);
    expect(result).toEqual('addedPoint');
  });

  it('Should return true for new song recommendation', async () => {
    mockRecommendationRepository.selectQuery.undefined();
    mockRecommendationRepository.insertRecommendation.true();

    const result = await sut.insertRecommendation(mockRecommendationBody);
    expect(result).toBeTruthy();
  });
});
