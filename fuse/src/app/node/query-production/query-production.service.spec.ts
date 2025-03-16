import { TestBed } from '@angular/core/testing';

import { QueryProductionService } from './query-production.service';

describe('QueryProductionService', () => {
  let service: QueryProductionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QueryProductionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
