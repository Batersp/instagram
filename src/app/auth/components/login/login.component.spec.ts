import { LoginComponent } from './login.component'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { Router } from '@angular/router'
import { RouterTestingModule } from '@angular/router/testing'
import { LoggerService } from '../../../logger.service'
import { AuthService } from '../../../core/services/auth.service'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('LoginComponent ', () =>{
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  const fakeAuthService = jasmine.createSpyObj('authService', ['login', 'logout', 'me']);
  const fakeLoggerService = jasmine.createSpyObj('LoggerService', ['log'])

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [ LoginComponent ],
      providers: [
        { provide: LoggerService, useValue: fakeLoggerService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
      .compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.login and loggerService.log when onLoginSubmit is called', () => {
    const email = 'test@test.com';
    const password = '1234';
    const rememberMe = true;

    component.loginForm.setValue({ email, password, rememberMe });
    component.onLoginSubmit();

    expect(fakeAuthService.login).toHaveBeenCalledWith({ email, password, rememberMe });
  });
});
