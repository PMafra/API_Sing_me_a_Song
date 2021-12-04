import * as recommendationService from '../../../src/services/recommendationService.js';
import * as recommendationRepository from '../../../src/repositories/recommendationRepository.js';
import NotFoundError from '../../../src/errors/notFoundError.js';

const sut = recommendationService;
const mockVoteId = {
  id: 1,
};

describe('Increase and decrease score services tests', () => {
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
});
