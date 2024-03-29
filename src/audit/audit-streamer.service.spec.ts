import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { AuditStreamerService } from './audit-streamer.service';

describe('AuditStreamerService', () => {
  let service: AuditStreamerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuditStreamerService],
    })
      .useMocker(createMock)
      .compile();

    service = module.get<AuditStreamerService>(AuditStreamerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
