import * as recommendationFactory from '../../factories/recommendationFactory.js';
import * as recommendationService from '../../../src/services/recommendationService.js';
import NotFoundError from '../../../src/errors/notFoundError.js';
import { mockRecommendationRepository } from '../../factories/mockFactory.js';

const sut = recommendationService;
const mockLowScoreRecommendation = recommendationFactory.createRecomendations({
  length: 1, score: 5, isBody: false,
});
const mockHighScoreRecommendation = recommendationFactory.createRecomendations({
  length: 1, score: 13, isBody: false,
});

describe('Get random recommendations service tests', () => {
  it('Should return Not Found Error for no recommendations found', async () => {
    mockRecommendationRepository.selectQuery([]);

    const promise = sut.getRandomRecommendations();
    await expect(promise).rejects.toThrowError(NotFoundError);
  });

  it('Should return recommendation with score > 10', async () => {
    mockRecommendationRepository.selectQuery(['filled']);
    jest.spyOn(Math, 'random').mockReturnValueOnce(() => 0.6);
    mockRecommendationRepository.selectQuery(mockHighScoreRecommendation);

    const result = await sut.getRandomRecommendations();
    expect(result).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        youtubeLink: expect.stringContaining('youtube.com/watch?'),
        score: expect.any(Number),
      }),
    );
    expect(result.score).toBeGreaterThan(10);
  });

  it('Should return recommendation with score between -5 and 10', async () => {
    mockRecommendationRepository.selectQuery(['filled']);
    jest.spyOn(Math, 'random').mockReturnValueOnce(() => 0.8);
    mockRecommendationRepository.selectQuery(mockLowScoreRecommendation);

    const result = await sut.getRandomRecommendations();
    expect(result).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        youtubeLink: expect.stringContaining('youtube.com/watch?'),
        score: expect.any(Number),
      }),
    );
    expect(result.score).toBeGreaterThanOrEqual(-5);
    expect(result.score).toBeLessThanOrEqual(10);
  });

  it('Should return any recommendation', async () => {
    mockRecommendationRepository.selectQuery(['filled']);
    mockRecommendationRepository.selectQuery(mockLowScoreRecommendation);

    const result = await sut.getRandomRecommendations();
    expect(result).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        youtubeLink: expect.stringContaining('youtube.com/watch?'),
        score: expect.any(Number),
      }),
    );
  });
});
