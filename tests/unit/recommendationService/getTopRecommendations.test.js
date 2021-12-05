import * as recommendationRepository from '../../../src/repositories/recommendationRepository.js';
import * as recommendationService from '../../../src/services/recommendationService.js';
import NotFoundError from '../../../src/errors/notFoundError.js';
import * as recommendationFactory from '../../factories/recommendationFactory.js';

jest.mock('youtube-validate');
const sut = recommendationService;
const mockRecommendationsList = recommendationFactory.createRecomendations({
  length: 3, score: null, isBody: false,
});
const mockAmount = {
  amount: 3,
};

describe('Get top recommendations service tests', () => {
  it('Should return Not Found Error for no recommendations found', async () => {
    jest.spyOn(recommendationRepository, 'selectQuery').mockImplementationOnce(() => []);

    const promise = sut.getTopRecommendations({ amount: 1 });
    await expect(promise).rejects.toThrowError(NotFoundError);
  });

  it('Should return top recommendations list ordered by descending score points', async () => {
    jest.spyOn(recommendationRepository, 'selectQuery').mockImplementationOnce(() => mockRecommendationsList);

    const result = await sut.getTopRecommendations(mockAmount);
    expect(result).toHaveLength(mockAmount.amount);

    let scoreToCompare = result[0].score;
    result.forEach((object) => {
      expect(object).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          youtubeLink: expect.stringContaining('youtube.com/watch?'),
          score: expect.any(Number),
        }),
      );
      expect(object.score).toBeLessThanOrEqual(scoreToCompare);
      scoreToCompare = object.score;
    });
  });
});
