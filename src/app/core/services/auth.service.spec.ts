import { AuthService } from './auth.service';
import { fakeAsync, TestBed, tick } from '@angular/core/testing'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/core/services/notification.service';
import { of } from 'rxjs';
import { ResultCodeEnum } from 'src/app/core/enums/resultCode.enum';

describe('AuthService', () => {
  let authService: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  const fakeNotificationService = jasmine.createSpyObj('NotificationService', ['handleError']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        AuthService,
        { provide: NotificationService, useValue: fakeNotificationService }
      ]
    });

    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);

    spyOn(router, 'navigate');

    fakeNotificationService.reset
  });

  afterEach(() => {
    httpMock.verify();
    fakeNotificationService.reset
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('should initialize resolveAuthRequest as a function', () => {
    authService.resolveAuthRequest();
    expect(typeof authService.resolveAuthRequest).toBe('function');
  });

  it('should return the router instance', () => {
    const router = authService.getRouter();
    expect(router).toBeInstanceOf(Router);
  });

  it('should navigate to "/" after successful login',fakeAsync(() => {
    const mockResponse = { resultCode: ResultCodeEnum.success, messages: [], data: { userId: 123 } };
    authService.login({ email: 'test@test.com', password: '1234', rememberMe: true });
    const req = httpMock.expectOne(`${authService.baseUrl}/auth/login`);
    req.flush(mockResponse);
    tick();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
    }));

  it('should handle error and show notification after unsuccessful login', fakeAsync(() => {
    const mockResponse = { resultCode: ResultCodeEnum.error, messages: ['Login failed'], data: null };
    authService.login({ email: 'test@test.com', password: '1234', rememberMe: true });
    const req = httpMock.expectOne(`${authService.baseUrl}/auth/login`);
    req.flush(mockResponse);
    tick();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(fakeNotificationService.handleError).toHaveBeenCalledWith('Login failed');
  }));

  it('should navigate to "/login" after successful logout', fakeAsync(() => {
    const mockResponse = { resultCode: ResultCodeEnum.success, messages: [], data: null };
    authService.logout();
    const req = httpMock.expectOne(`${authService.baseUrl}/auth/login`);
    req.flush(mockResponse);
    tick();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('should stay login after unsuccessful logout', fakeAsync(() => {
    const mockResponse = { resultCode: ResultCodeEnum.error, messages: [], data: null };
    authService.logout();
    const req = httpMock.expectOne(`${authService.baseUrl}/auth/login`);
    req.flush(mockResponse);
    tick();
    expect(router.navigate).not.toHaveBeenCalled();
  }));

  it('should set isAuth to true after successful "me" request', fakeAsync(() => {
    spyOn(authService, 'resolveAuthRequest');
    const mockResponse = { resultCode: ResultCodeEnum.success, messages: [], data: null };
    authService.me();
    const req = httpMock.expectOne(`${authService.baseUrl}/auth/me`);
    req.flush(mockResponse);
    tick();
    expect(authService.isAuth).toBe(true);
    expect(authService.resolveAuthRequest).toHaveBeenCalled();
  }));

  it('should stay isAuth is false after unsuccessful "me" request', fakeAsync(() => {
    spyOn(authService, 'resolveAuthRequest');
    const mockResponse = { resultCode: ResultCodeEnum.error, messages: [], data: null };
    authService.me();
    const req = httpMock.expectOne(`${authService.baseUrl}/auth/me`);
    req.flush(mockResponse);
    tick();
    expect(authService.isAuth).not.toBe(true);
  }));


  it('should handle error and return EMPTY observable on error in "me" request', fakeAsync(() => {
    spyOn(authService, 'resolveAuthRequest');
    fakeNotificationService.handleError.and.returnValue(of(null));
    TestBed.compileComponents();
    authService.me();
    const req = httpMock.expectOne(`${authService.baseUrl}/auth/me`);
    expect(req.request.method).toBe('GET');
    req.error(new ErrorEvent('Internal Server Error'));
    authService.resolveAuthRequest();
    tick();
    expect(authService.isAuth).toBe(false);
    expect(authService.resolveAuthRequest).toHaveBeenCalled();
    expect(fakeNotificationService.handleError).toHaveBeenCalledWith('Http failure response for https://social-network.samuraijs.com/api/1.1/auth/me: 0 ');
  }));

});
