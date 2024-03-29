import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { PreferenceService } from './preference.service';

describe('PreferenceService', () => {
  let service: PreferenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PreferenceService],
    })
      .useMocker(createMock)
      .compile();

    service = module.get<PreferenceService>(PreferenceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
