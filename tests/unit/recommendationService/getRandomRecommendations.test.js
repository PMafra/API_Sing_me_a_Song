import * as recommendationFactory from '../../factories/recommendationFactory.js';
import * as recommendationService from '../../../src/services/recommendationService.js';
import * as recommendationRepository from '../../../src/repositories/recommendationRepository.js';
import NotFoundError from '../../../src/errors/notFoundError.js';

const sut = recommendationService;
const mockLowScoreRecommendation = recommendationFactory.createRecomendations({
  length: 1, score: 5, isBody: false,
});
const mockHighScoreRecommendation = recommendationFactory.createRecomendations({
  length: 1, score: 13, isBody: false,
});
const mockSelect = jest.spyOn(recommendationRepository, 'selectQuery');
const mockRecommendationRepository = {
  selectQuery: {
    empty: () => mockSelect.mockImplementationOnce(() => []),
    filled: () => mockSelect.mockImplementationOnce(() => ['filled']),
    highScore: () => mockSelect.mockImplementationOnce(() => mockHighScoreRecommendation),
    lowScore: () => mockSelect.mockImplementationOnce(() => mockLowScoreRecommendation),
  },
};

describe('Get random recommendations service tests', () => {
  it('Should return Not Found Error for no recommendations found', async () => {
    mockRecommendationRepository.selectQuery.empty();

    const promise = sut.getRandomRecommendations();
    await expect(promise).rejects.toThrowError(NotFoundError);
  });

  it('Should return recommendation with score > 10', async () => {
    mockRecommendationRepository.selectQuery.filled();
    jest.spyOn(Math, 'random').mockReturnValueOnce(() => 0.6);
    mockRecommendationRepository.selectQuery.highScore();

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
    mockRecommendationRepository.selectQuery.filled();
    jest.spyOn(Math, 'random').mockReturnValueOnce(() => 0.8);
    mockRecommendationRepository.selectQuery.lowScore();

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
    mockRecommendationRepository.selectQuery.filled();
    mockRecommendationRepository.selectQuery.lowScore();

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
