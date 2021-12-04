/* eslint-disable no-console */
import { validateUrl } from 'youtube-validate';
import * as recommendationRepository from '../../src/repositories/recommendationRepository.js';
import * as recommendationService from '../../src/services/recommendationService.js';
import recommendationSchema from '../../src/validations/recommendationSchema.js';
import NotFoundError from '../../src/errors/notFoundError.js';
import RequestError from '../../src/errors/requestError.js';
import * as recommendationFactory from '../factories/recommendationFactory.js';

const sut = recommendationService;
jest.mock('youtube-validate');

const mockRecommendationObject = recommendationFactory.createRecomendations(
  { length: null, score: null, isBody: true },
);

const mockVoteId = {
  id: 1,
};

describe('Recommendation service test', () => {
  // VALIDATE

  it('Should return Request Error for not valid body', async () => {
    jest.spyOn(recommendationSchema, 'validate').mockImplementationOnce(() => ({
      error: {
        details: [{
          message: 'error message',
        }],
      },
    }));

    const promise = sut.validateRecommendationBody();
    await expect(promise).rejects.toThrowError(RequestError);
  });

  it('Should return Request Error for not valid url', async () => {
    jest.spyOn(recommendationSchema, 'validate').mockImplementationOnce(() => ({
      error: false,
    }));
    validateUrl.mockRejectedValue(() => 'err');
    const promise = sut.validateRecommendationBody(mockRecommendationObject);
    await expect(promise).rejects.toThrowError(RequestError);
  });

  it('Should return true for valid body', async () => {
    jest.spyOn(recommendationSchema, 'validate').mockImplementationOnce(() => ({
      error: false,
    }));
    validateUrl.mockResolvedValue(() => true);
    const result = await sut.validateRecommendationBody(mockRecommendationObject);
    expect(result).toBeTruthy();
  });

  // INSERT

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

  // INCREASE SCORE

  it('Should return Not Found Error for not existant song id', async () => {
    jest.spyOn(recommendationRepository, 'updateScore').mockImplementationOnce(() => undefined);

    const promise = sut.increaseScore(mockVoteId);
    await expect(promise).rejects.toThrowError(NotFoundError);
  });

  it('Should return true for sucess increasing song recommendation score', async () => {
    jest.spyOn(recommendationRepository, 'updateScore').mockImplementationOnce(() => true);

    const result = await sut.increaseScore(mockVoteId);
    expect(result).toBeTruthy();
  });

  // DECREASE SCORE

  it('Should return Not Found Error for not existant song id', async () => {
    jest.spyOn(recommendationRepository, 'updateScore').mockImplementationOnce(() => undefined);

    const promise = sut.decreaseScore(mockVoteId);
    await expect(promise).rejects.toThrowError(NotFoundError);
  });

  it('Should delete song recommendation when decreased score is less than -5 points', async () => {
    jest.spyOn(recommendationRepository, 'updateScore').mockImplementationOnce(() => (
      { score: -6 }
    ));
    jest.spyOn(recommendationRepository, 'deleteRecommendation').mockImplementationOnce(() => true);

    const result = await sut.decreaseScore(mockVoteId);
    expect(result).toEqual('deleted');
  });

  it('Should return true for sucess decreasing song recommendation score', async () => {
    jest.spyOn(recommendationRepository, 'updateScore').mockImplementationOnce(() => (
      { score: -1 }
    ));

    const result = await sut.decreaseScore(mockVoteId);
    expect(result).toBeTruthy();
  });

  // GET RANDOM

  it('Should return Not Found Error for no recommendations found', async () => {
    jest.spyOn(recommendationRepository, 'selectAll').mockImplementationOnce(() => []);

    const promise = sut.getRandomRecommendations();
    await expect(promise).rejects.toThrowError(NotFoundError);
  });

  it('Should return recommendation with score > 10', async () => {
    jest.spyOn(recommendationRepository, 'selectAll').mockImplementationOnce(() => ['filled']);
    jest.spyOn(Math, 'random').mockReturnValueOnce(() => 0.6);
    jest.spyOn(recommendationRepository, 'selectRandom').mockImplementationOnce(() => (
      recommendationFactory.createRecomendations({ length: 1, score: 13, isBody: false })
    ));

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
    jest.spyOn(recommendationRepository, 'selectAll').mockImplementationOnce(() => ['filled']);
    jest.spyOn(Math, 'random').mockReturnValueOnce(() => 0.8);
    jest.spyOn(recommendationRepository, 'selectRandom').mockImplementationOnce(() => (
      recommendationFactory.createRecomendations({ length: 1, score: 5, isBody: false })
    ));

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
    jest.spyOn(recommendationRepository, 'selectAll').mockImplementationOnce(() => ['filled']);
    jest.spyOn(recommendationRepository, 'selectRandom').mockImplementationOnce(() => (
      recommendationFactory.createRecomendations({ length: 1, score: 5, isBody: false })
    ));

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

  // GET TOP

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
