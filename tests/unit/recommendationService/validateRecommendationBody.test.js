import { validateUrl } from 'youtube-validate';
import RequestError from '../../../src/errors/requestError.js';
import * as recommendationFactory from '../../factories/recommendationFactory.js';
import * as recommendationService from '../../../src/services/recommendationService.js';
import { mockRecommendationRepository } from '../../factories/mockFactory.js';

jest.mock('youtube-validate');
const sut = recommendationService;
const mockRecommendationObject = recommendationFactory.createRecomendations(
  { length: null, score: null, isBody: true },
);
const mockSchemaError = {
  error: {
    details: [{
      message: 'error message',
    }],
  },
};
const mockNoError = {
  error: false,
};

describe('Validate recommendation body service tests', () => {
  it('Should return Request Error for not valid body', async () => {
    mockRecommendationRepository.validate(mockSchemaError);

    const promise = sut.validateRecommendationBody();
    await expect(promise).rejects.toThrowError(RequestError);
  });

  it('Should return Request Error for not valid url', async () => {
    mockRecommendationRepository.validate(mockNoError);

    validateUrl.mockRejectedValue(() => 'err');
    const promise = sut.validateRecommendationBody(mockRecommendationObject);
    await expect(promise).rejects.toThrowError(RequestError);
  });

  it('Should return true for valid body', async () => {
    mockRecommendationRepository.validate(mockNoError);

    validateUrl.mockResolvedValue(() => true);
    const result = await sut.validateRecommendationBody(mockRecommendationObject);
    expect(result).toBeTruthy();
  });
});
