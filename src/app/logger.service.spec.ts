import { TestBed } from '@angular/core/testing';

import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log a message to the console', () => {
    spyOn(console, 'log');
    const message = 'Test message';
    service.log(message);
    expect(console.log).toHaveBeenCalledWith(message);
  });
});
