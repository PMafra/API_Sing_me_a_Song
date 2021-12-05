import { validateUrl } from 'youtube-validate';
import recommendationSchema from '../../../src/validations/recommendationSchema.js';
import RequestError from '../../../src/errors/requestError.js';
import * as recommendationFactory from '../../factories/recommendationFactory.js';
import * as recommendationService from '../../../src/services/recommendationService.js';

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
const mockValidate = jest.spyOn(recommendationSchema, 'validate');
const mockRecommendationRepository = {
  validate: {
    schemaError: () => mockValidate.mockImplementationOnce(() => mockSchemaError),
    noError: () => mockValidate.mockImplementationOnce(() => mockNoError),
  },
};

describe('Validate recommendation body service tests', () => {
  it('Should return Request Error for not valid body', async () => {
    mockRecommendationRepository.validate.schemaError();

    const promise = sut.validateRecommendationBody();
    await expect(promise).rejects.toThrowError(RequestError);
  });

  it('Should return Request Error for not valid url', async () => {
    mockRecommendationRepository.validate.noError();

    validateUrl.mockRejectedValue(() => 'err');
    const promise = sut.validateRecommendationBody(mockRecommendationObject);
    await expect(promise).rejects.toThrowError(RequestError);
  });

  it('Should return true for valid body', async () => {
    mockRecommendationRepository.validate.noError();

    validateUrl.mockResolvedValue(() => true);
    const result = await sut.validateRecommendationBody(mockRecommendationObject);
    expect(result).toBeTruthy();
  });
});
