import { TestBed } from '@angular/core/testing';

import { FormResponseApiService } from './form-response-api.service';

describe('FormResponseApiService', () => {
  let service: FormResponseApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormResponseApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
