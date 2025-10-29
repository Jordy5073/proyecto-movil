import { TestBed } from '@angular/core/testing';

import { FormStat } from './form-state';

describe('FormStat', () => {
  let service: FormStat;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormStat);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
