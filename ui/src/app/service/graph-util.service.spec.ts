import { TestBed } from '@angular/core/testing';

import { GraphUtilService } from './graph-util.service';

describe('UtilService', () => {
  let service: GraphUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraphUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
