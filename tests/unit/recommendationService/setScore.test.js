import * as recommendationService from '../../../src/services/recommendationService.js';
import * as recommendationRepository from '../../../src/repositories/recommendationRepository.js';
import NotFoundError from '../../../src/errors/notFoundError.js';

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
const mockUpdate = jest.spyOn(recommendationRepository, 'updateScore');
const mockDelete = jest.spyOn(recommendationRepository, 'deleteRecommendation');
const mockRecommendationRepository = {
  updateScore: {
    true: () => mockUpdate.mockImplementationOnce(() => true),
    undefined: () => mockUpdate.mockImplementationOnce(() => undefined),
    minScore: () => mockUpdate.mockImplementationOnce(() => mockLowScore),
    anyScore: () => mockUpdate.mockImplementationOnce(() => mockScore),
  },
  deleteRecommendation: {
    true: () => mockDelete.mockImplementationOnce(() => true),
  },
};

describe('Increase and decrease score services tests', () => {
  // INCREASE SCORE

  it('Should return Not Found Error for not existant song id', async () => {
    mockRecommendationRepository.updateScore.undefined();

    const promise = sut.increaseScore(mockVoteId);
    await expect(promise).rejects.toThrowError(NotFoundError);
  });

  it('Should return true for sucess increasing song recommendation score', async () => {
    mockRecommendationRepository.updateScore.true();

    const result = await sut.increaseScore(mockVoteId);
    expect(result).toBeTruthy();
  });

  // DECREASE SCORE

  it('Should return Not Found Error for not existant song id', async () => {
    mockRecommendationRepository.updateScore.undefined();

    const promise = sut.decreaseScore(mockVoteId);
    await expect(promise).rejects.toThrowError(NotFoundError);
  });

  it('Should delete song recommendation when decreased score is less than -5 points', async () => {
    mockRecommendationRepository.updateScore.minScore();
    mockRecommendationRepository.deleteRecommendation.true();

    const result = await sut.decreaseScore(mockVoteId);
    expect(result).toEqual('deleted');
  });

  it('Should return true for sucess decreasing song recommendation score', async () => {
    mockRecommendationRepository.updateScore.anyScore();

    const result = await sut.decreaseScore(mockVoteId);
    expect(result).toBeTruthy();
  });
});
