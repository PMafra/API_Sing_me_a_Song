import * as recommendationFactory from '../../factories/recommendationFactory.js';
import * as recommendationService from '../../../src/services/recommendationService.js';
import * as recommendationRepository from '../../../src/repositories/recommendationRepository.js';

const sut = recommendationService;

const mockRecommendationObject = recommendationFactory.createRecomendations(
  { length: null, score: null, isBody: true },
);

describe('Insert recommendation service tests', () => {
  it('Should return "addedPoint" when recommendation already exists', async () => {
    jest.spyOn(recommendationRepository, 'selectRecommendation').mockImplementationOnce(() => ({
      id: 15,
      name: 'system',
      youtubeLink: 'https://www.youtube.com/watch?v=chwyjJbcs1Y',
      score: 4,
    }));
    jest.spyOn(recommendationRepository, 'updateScore').mockImplementationOnce(() => true);

    const result = await sut.insertRecommendation(mockRecommendationObject);
    expect(result).toEqual('addedPoint');
  });

  it('Should return true for new song recommendation', async () => {
    jest.spyOn(recommendationRepository, 'selectRecommendation').mockImplementationOnce(() => undefined);
    jest.spyOn(recommendationRepository, 'insertRecommendation').mockImplementationOnce(() => true);

    const result = await sut.insertRecommendation(mockRecommendationObject);
    expect(result).toBeTruthy();
  });
});
