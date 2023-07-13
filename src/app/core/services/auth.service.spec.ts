import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { LoginRequestData, MeResponse } from 'src/app/core/models/auth.models';
import { ResultCodeEnum } from 'src/app/core/enums/resultCode.enum';
import { EMPTY } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let notificationService: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService, NotificationService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    notificationService = TestBed.inject(NotificationService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login()', () => {
    it('should navigate to home page if login is successful', () => {
      const loginRequestData: LoginRequestData = { email: 'test@test.com', password: '123', rememberMe: true };
      const successResponse = { data: { userId: 1 }, messages: [], resultCode: ResultCodeEnum.success };

      spyOn(service.getRouter(), 'navigate');

      service.login(loginRequestData);

      const req = httpMock.expectOne(`${service.baseUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      req.flush(successResponse);

      expect(service.getRouter().navigate).toHaveBeenCalledWith(['/']);
      expect(notificationService.handleError).not.toHaveBeenCalled();
    });

    it('should show error notification if login is unsuccessful', () => {
      const loginRequestData: LoginRequestData = { email: 'test@test.com', password: '123', rememberMe: true };
      const errorResponse = { data: {}, messages: ['Invalid username or password'], resultCode: ResultCodeEnum.error };

      spyOn(notificationService, 'handleError');

      service.login(loginRequestData);

      const req = httpMock.expectOne(`${service.baseUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      req.flush(errorResponse);

      expect(notificationService.handleError).toHaveBeenCalledWith('Invalid username or password');
      expect(service.getRouter().navigate).not.toHaveBeenCalled();
    });
  });

  describe('logout()', () => {
    it('should navigate to login page if logout is successful', () => {
      const successResponse = { data: {}, messages: [], resultCode: ResultCodeEnum.success };

      spyOn(service.getRouter(), 'navigate');

      service.logout();

      const req = httpMock.expectOne(`${service.baseUrl}/auth/login`);
      expect(req.request.method).toBe('DELETE');
      req.flush(successResponse);

      expect(service.getRouter().navigate).toHaveBeenCalledWith(['/login']);
      expect(notificationService.handleError).not.toHaveBeenCalled();
    });
  });

  describe('me()', () => {
    it('should set isAuth to true if user is authenticated', () => {
      const successResponse = { data: { isAuthenticated: true }, messages: [], resultCode: ResultCodeEnum.success };

      service.me();

      const req = httpMock.expectOne(`${service.baseUrl}/auth/me`);
      expect(req.request.method).toBe('GET');
      req.flush(successResponse);

      expect(service.isAuth).toBeTrue();
      expect(service.resolveAuthRequest).toHaveBeenCalled();
      expect(notificationService.handleError).not.toHaveBeenCalled();
    });

    it('should not set isAuth to true if user is not authenticated', () => {
      const successResponse = { data: { isAuthenticated: false }, messages: [], resultCode: ResultCodeEnum.success };

      service.me();

      const req = httpMock.expectOne(`${service.baseUrl}/auth/me`);
      expect(req.request.method).toBe('GET');
      req.flush(successResponse);

      expect(service.isAuth).toBeFalse();
      expect(service.resolveAuthRequest).toHaveBeenCalled();
      expect(notificationService.handleError).not.toHaveBeenCalled();
    });

    it('should show error notification if there is an error', () => {
      spyOn(notificationService, 'handleError');
      spyOn(service, 'resolveAuthRequest');

      service.me();

      const req = httpMock.expectOne(`${service.baseUrl}/auth/me`);
      expect(req.request.method).toBe('GET');
      req.error(new ErrorEvent('network error'));

      expect(notificationService.handleError).toHaveBeenCalledWith('network error');
      expect(service.isAuth).toBeFalse();
      expect(service.resolveAuthRequest).toHaveBeenCalled();
    });
  });
});
