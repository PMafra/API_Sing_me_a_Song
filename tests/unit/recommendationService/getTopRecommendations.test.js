/* eslint-disable no-console */
import * as recommendationRepository from '../../../src/repositories/recommendationRepository.js';
import * as recommendationService from '../../../src/services/recommendationService.js';
import NotFoundError from '../../../src/errors/notFoundError.js';
import * as recommendationFactory from '../../factories/recommendationFactory.js';

const sut = recommendationService;
jest.mock('youtube-validate');

describe('Get top recommendations service tests', () => {
  it('Should return Not Found Error for no recommendations found', async () => {
    jest.spyOn(recommendationRepository, 'selectTop').mockImplementationOnce(() => []);

    const promise = sut.getTopRecommendations({ amount: 1 });
    await expect(promise).rejects.toThrowError(NotFoundError);
  });

  it('Should return top recommendations list ordered by descending score points', async () => {
    const mockAmount = {
      amount: 3,
    };
    jest.spyOn(recommendationRepository, 'selectTop').mockImplementationOnce(() => (
      recommendationFactory.createRecomendations({ length: 3, score: null, isBody: false })
    ));

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
