import * as recommendationFactory from '../../factories/recommendationFactory.js';
import * as recommendationService from '../../../src/services/recommendationService.js';
import { mockRecommendationRepository } from '../../factories/mockFactory.js';

const sut = recommendationService;

const mockRecommendationBody = recommendationFactory.createRecomendations(
  { length: null, score: null, isBody: true },
);
const mockRecommendation = recommendationFactory.createRecomendations({
  length: 1, score: 1, isBody: false,
});

describe('Insert recommendation service tests', () => {
  it('Should return "addedPoint" when recommendation already exists', async () => {
    mockRecommendationRepository.selectQuery(mockRecommendation);
    mockRecommendationRepository.updateScore(true);

    const result = await sut.insertRecommendation(mockRecommendationBody);
    expect(result).toEqual('addedPoint');
  });

  it('Should return true for new song recommendation', async () => {
    mockRecommendationRepository.selectQuery(undefined);
    mockRecommendationRepository.insertRecommendation(true);

    const result = await sut.insertRecommendation(mockRecommendationBody);
    expect(result).toBeTruthy();
  });
});
