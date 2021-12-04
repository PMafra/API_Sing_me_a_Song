import { validateUrl } from 'youtube-validate';
import * as recommendationRepository from '../../src/repositories/recommendationRepository.js';
import * as recommendationService from '../../src/services/recommendationService.js';
import recommendationSchema from '../../src/validations/recommendationSchema.js';
import NotFoundError from '../../src/errors/notFoundError.js';
import RequestError from '../../src/errors/requestError.js';

const sut = recommendationService;
jest.mock('youtube-validate');

describe('Recommendation service test', () => {
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
    const promise = sut.validateRecommendationBody({
      name: 'avenged',
      youtubeLink: 'https://www.youtube.com/watch?v=chwyjJbcs1Y',
    });
    await expect(promise).rejects.toThrowError(RequestError);
  });

  it('Should return true for valid body', async () => {
    jest.spyOn(recommendationSchema, 'validate').mockImplementationOnce(() => ({
      error: false,
    }));
    validateUrl.mockResolvedValue(() => true);
    const result = await sut.validateRecommendationBody({
      name: 'avenged',
      youtubeLink: 'https://www.youtube.com/watch?v=chwyjJbcs1Y',
    });
    expect(result).toEqual(true);
  });

  it('Should return "addedPoint" for recommendation already existing', async () => {
    const mockRecommendationObject = {
      name: 'Falamansa - Xote dos Milagres',
      youtubeLink: 'https://www.youtube.com/watch?v=chwyjJbcs1Y',
    };
    jest.spyOn(recommendationRepository, 'selectRecommendation').mockImplementationOnce(() => true);
    jest.spyOn(recommendationRepository, 'updateScore').mockImplementationOnce(() => true);

    const result = await sut.insertRecommendation(mockRecommendationObject);
    expect(result).toEqual('addedPoint');
  });

  it('Should return true for new song recommendation', async () => {
    const mockRecommendationObject = {
      name: 'Falamansa - Xote dos Milagres',
      youtubeLink: 'https://www.youtube.com/watch?v=chwyjJbcs1Y',
    };
    jest.spyOn(recommendationRepository, 'selectRecommendation').mockImplementationOnce(() => false);
    jest.spyOn(recommendationRepository, 'insertRecommendation').mockImplementationOnce(() => true);

    const result = await sut.insertRecommendation(mockRecommendationObject);
    expect(result).toEqual(true);
  });

  it('Should return Not Found Error for not existant id', async () => {
    const mockUpvoteId = {
      id: 1,
    };
    jest.spyOn(recommendationRepository, 'updateScore').mockImplementationOnce(() => false);

    const promise = sut.increaseScore(mockUpvoteId);
    await expect(promise).rejects.toThrowError(NotFoundError);
  });

  it('Should return true for increased recommendation score', async () => {
    const mockUpvoteId = {
      id: 1,
    };
    jest.spyOn(recommendationRepository, 'updateScore').mockImplementationOnce(() => true);

    const result = await sut.increaseScore(mockUpvoteId);
    expect(result).toEqual(true);
  });

  it('Should return Not Found Error for not existant id', async () => {
    const mockUpvoteId = {
      id: 1,
    };
    jest.spyOn(recommendationRepository, 'updateScore').mockImplementationOnce(() => false);

    const promise = sut.decreaseScore(mockUpvoteId);
    await expect(promise).rejects.toThrowError(NotFoundError);
  });

  it('Should delete recommendation when decreased score is less than -5 points', async () => {
    const mockUpvoteId = {
      id: 1,
    };
    jest.spyOn(recommendationRepository, 'updateScore').mockImplementationOnce(() => (
      { score: -6 }
    ));
    jest.spyOn(recommendationRepository, 'deleteRecommendation').mockImplementationOnce(() => true);

    const result = await sut.decreaseScore(mockUpvoteId);
    expect(result).toEqual('deleted');
  });

  it('Should return true for decreased recommendation score', async () => {
    const mockUpvoteId = {
      id: 1,
    };
    jest.spyOn(recommendationRepository, 'updateScore').mockImplementationOnce(() => (
      { score: -1 }
    ));

    const result = await sut.decreaseScore(mockUpvoteId);
    expect(result).toEqual(true);
  });

  it('Should return Not Found Error for no recommendations found', async () => {
    jest.spyOn(recommendationRepository, 'selectAll').mockImplementationOnce(() => []);

    const promise = sut.getRandomRecommendations();
    await expect(promise).rejects.toThrowError(NotFoundError);
  });

  it('Should return recommendation with score > 10', async () => {
    jest.spyOn(recommendationRepository, 'selectAll').mockImplementationOnce(() => ['filled']);
    jest.spyOn(recommendationRepository, 'selectRandom').mockImplementationOnce(() => (
      {
        id: 13,
        name: 'alok',
        youtubeLink: 'https://www.youtube.com/watch?v=chwyjJbcs1Y',
        score: 13,
      }
    ));

    const result = await sut.getRandomRecommendations();
    expect(result).toEqual({
      id: 13,
      name: 'alok',
      youtubeLink: 'https://www.youtube.com/watch?v=chwyjJbcs1Y',
      score: 13,
    });
  });

  it('Should return recommendation with score between -5 and 10', async () => {
    jest.spyOn(recommendationRepository, 'selectAll').mockImplementationOnce(() => ['filled']);
    jest.spyOn(recommendationRepository, 'selectRandom').mockImplementationOnce(() => (
      {
        id: 13,
        name: 'alok',
        youtubeLink: 'https://www.youtube.com/watch?v=chwyjJbcs1Y',
        score: 5,
      }
    ));

    const result = await sut.getRandomRecommendations();
    expect(result).toEqual({
      id: 13,
      name: 'alok',
      youtubeLink: 'https://www.youtube.com/watch?v=chwyjJbcs1Y',
      score: 5,
    });
  });

  it('Should return any recommendation', async () => {
    jest.spyOn(recommendationRepository, 'selectAll').mockImplementationOnce(() => ['filled']);
    jest.spyOn(recommendationRepository, 'selectRandom').mockImplementationOnce(() => (
      {
        id: 13,
        name: 'alok',
        youtubeLink: 'https://www.youtube.com/watch?v=chwyjJbcs1Y',
        score: 5,
      }
    ));

    const result = await sut.getRandomRecommendations();
    expect(result).toEqual({
      id: 13,
      name: 'alok',
      youtubeLink: 'https://www.youtube.com/watch?v=chwyjJbcs1Y',
      score: 5,
    });
  });

  it('Should return Not Found Error for no recommendations found', async () => {
    jest.spyOn(recommendationRepository, 'selectTop').mockImplementationOnce(() => []);

    const promise = sut.getTopRecommendations({ amount: 2 });
    await expect(promise).rejects.toThrowError(NotFoundError);
  });

  it('Should return top recommendations list ordered by descending score points', async () => {
    jest.spyOn(recommendationRepository, 'selectTop').mockImplementationOnce(() => (
      [
        {
          id: 13,
          name: 'alok',
          youtubeLink: 'https://www.youtube.com/watch?v=chwyjJbcs1Y',
          score: 13,
        },
        {
          id: 14,
          name: 'avenged',
          youtubeLink: 'https://www.youtube.com/watch?v=chwyjJbcs1Y',
          score: 5,
        },
      ]
    ));

    const result = await sut.getTopRecommendations({ amount: 2 });
    expect(result).toEqual([
      {
        id: 13,
        name: 'alok',
        youtubeLink: 'https://www.youtube.com/watch?v=chwyjJbcs1Y',
        score: 13,
      },
      {
        id: 14,
        name: 'avenged',
        youtubeLink: 'https://www.youtube.com/watch?v=chwyjJbcs1Y',
        score: 5,
      },
    ]);
  });
});
