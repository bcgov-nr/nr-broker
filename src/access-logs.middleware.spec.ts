import { AccessLogsMiddleware } from './access-logs.middleware';
import { AuditService } from './audit/audit.service';

describe('AccessLogsMiddleware', () => {
  it('should be defined', () => {
    expect(
      new AccessLogsMiddleware(new AuditService(undefined, undefined)),
    ).toBeDefined();
  });

  it('should call recordHttpAccess upon use', () => {
    const mockAuditService = {
      recordHttpAccess: jest.fn(),
    } as unknown as AuditService;
    const service = new AccessLogsMiddleware(mockAuditService);
    const mockReq = 'req';
    let resFinishCb: () => void;
    const mockRes = {
      on: jest.fn((event, cb) => {
        resFinishCb = cb;
      }),
    };
    const mockNext = jest.fn();
    expect(service).toBeDefined();

    service.use(mockReq, mockRes, mockNext);
    expect(mockRes.on).toHaveBeenCalled();
    expect(mockRes.on).toHaveBeenCalledWith('finish', expect.any(Function));
    expect(mockNext).toHaveBeenCalled();

    resFinishCb();

    expect(mockAuditService.recordHttpAccess).toHaveBeenCalled();
    expect(mockAuditService.recordHttpAccess).toHaveBeenCalledWith(
      mockReq,
      mockRes,
      expect.any(Date),
      expect.any(Date),
    );
    const startDate = jest
      .mocked(mockAuditService.recordHttpAccess)
      .mock.lastCall[2].valueOf();
    const endDate = jest
      .mocked(mockAuditService.recordHttpAccess)
      .mock.lastCall[3].valueOf();
    expect(startDate <= endDate).toBe(true);
  });
});
