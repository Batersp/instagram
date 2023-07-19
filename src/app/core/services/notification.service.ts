import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { Notify } from 'src/app/core/models/notify.models'
import { LoggerService } from '../../logger.service'

@Injectable()
export class NotificationService {
  notify$ = new BehaviorSubject<Notify | null>(null)
  constructor(
    private logger: LoggerService,
  ) {}
  handleError(message: string) {
    this.notify$.next({ severity: 'error', message });
    this.logger.log('Login error');
  }

  handleSuccess(message: string) {
    this.notify$.next({ severity: 'success', message });
    this.logger.log('Login success');
  }

  clear() {
    this.notify$.next(null);
    this.logger.log('Login error notification is closed');
  }
}
