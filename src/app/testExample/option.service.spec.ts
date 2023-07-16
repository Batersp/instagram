import { OptionService } from './option.service'
import { TestBed } from '@angular/core/testing'

describe('OptionService', () => {
  let optionService: OptionService
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OptionService,
      ],
    });
    optionService = TestBed.inject(OptionService);
  });

  it('should create instance', function() {
    expect(optionService).toBeTruthy();
  });

  it('returnString() should return Hi', function() {
    expect(optionService.returnString()).toBe('Hi');
  });
});
