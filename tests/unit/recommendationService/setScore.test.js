import * as recommendationService from '../../../src/services/recommendationService.js';
import NotFoundError from '../../../src/errors/notFoundError.js';
import { mockRecommendationRepository } from '../../factories/mockFactory.js';

const sut = recommendationService;
const mockVoteId = {
  id: 1,
};
const mockLowScore = {
  score: -6,
};
const mockScore = {
  score: -1,
};

describe('Increase and decrease score services tests', () => {
  // INCREASE SCORE

  it('Should return Not Found Error for not existant song id', async () => {
    mockRecommendationRepository.updateScore(undefined);

    const promise = sut.increaseScore(mockVoteId);
    await expect(promise).rejects.toThrowError(NotFoundError);
  });

  it('Should return true for sucess increasing song recommendation score', async () => {
    mockRecommendationRepository.updateScore(true);

    const result = await sut.increaseScore(mockVoteId);
    expect(result).toBeTruthy();
  });

  // DECREASE SCORE

  it('Should return Not Found Error for not existant song id', async () => {
    mockRecommendationRepository.updateScore(undefined);

    const promise = sut.decreaseScore(mockVoteId);
    await expect(promise).rejects.toThrowError(NotFoundError);
  });

  it('Should delete song recommendation when decreased score is less than -5 points', async () => {
    mockRecommendationRepository.updateScore(mockLowScore);
    mockRecommendationRepository.deleteRecommendation(true);

    const result = await sut.decreaseScore(mockVoteId);
    expect(result).toEqual('deleted');
  });

  it('Should return true for sucess decreasing song recommendation score', async () => {
    mockRecommendationRepository.updateScore(mockScore);

    const result = await sut.decreaseScore(mockVoteId);
    expect(result).toBeTruthy();
  });
});
