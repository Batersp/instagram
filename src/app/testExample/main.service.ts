import { Injectable } from '@angular/core'
import { OptionService } from 'src/app/testExample/option.service'

@Injectable({
  providedIn: 'root',
})
export class MainService {
  constructor(private optionService: OptionService) {
    this.optionService = optionService;
    this.optionService.returnString();
  }

  returnValue(value: number): number {
    return value
  }

  newMethod(): string {
    return this.optionService.returnString()
  }
}
