import { MainService } from 'src/app/testExample/main.service'
import { TestBed } from '@angular/core/testing'
import { OptionService } from 'src/app/testExample/option.service'

describe('MainService', () => {
  let service: MainService;
  let optionService: OptionService;

  const fakeOptionService = jasmine.createSpyObj(['returnString']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MainService, { provide: OptionService, useValue: fakeOptionService }],
    });
    service = TestBed.inject(MainService)
    optionService = TestBed.inject(OptionService)
  });

  it('should created', () => {
    expect(service).toBeDefined();
  });

  it('newMethod() should call returnString()' , () => {
    service.newMethod();
    expect(fakeOptionService.returnString).toHaveBeenCalled();
  });

  it('returnValue() should return value', () => {
    const result = service.returnValue(1);
    expect(result).toBe(1);
  });

});
