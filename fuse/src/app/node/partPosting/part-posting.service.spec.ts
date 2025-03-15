import { TestBed } from '@angular/core/testing';

import { PartPostingService } from './part-posting.service';

describe('PartPostingService', () => {
  let service: PartPostingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartPostingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
