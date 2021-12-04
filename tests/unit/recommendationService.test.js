import * as recommendationRepository from '../../src/repositories/recommendationRepository.js';
import * as recommendationService from '../../src/services/recommendationService.js';

const sut = recommendationService;
jest.mock('youtube-validate');

describe('Recommendation service test', () => {
  it('Should return "addedPoint" for recommendation already existing', async () => {
    const mockRecommendationBody = {
      name: 'Falamansa - Xote dos Milagres',
      youtubeLink: 'https://www.youtube.com/watch?v=chwyjJbcs1Y',
    };
    jest.spyOn(recommendationRepository, 'selectRecommendation').mockImplementationOnce(() => true);
    jest.spyOn(recommendationRepository, 'updateScore').mockImplementationOnce(() => true);

    const result = await sut.insertRecommendation(mockRecommendationBody);
    expect(result).toEqual('addedPoint');
  });
});
