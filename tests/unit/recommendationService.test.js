import * as recommendationRepository from '../../src/repositories/recommendationRepository.js';
import * as recommendationService from '../../src/services/recommendationService.js';
import NotFoundError from '../../src/errors/notFoundError.js';

const sut = recommendationService;
jest.mock('youtube-validate');

describe('Recommendation service test', () => {
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
});
