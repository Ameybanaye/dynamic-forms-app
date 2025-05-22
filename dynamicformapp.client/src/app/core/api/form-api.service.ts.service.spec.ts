import { TestBed } from '@angular/core/testing';

import { FormApiServiceTsService } from './form-api.service.ts.service';

describe('FormApiServiceTsService', () => {
  let service: FormApiServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormApiServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
