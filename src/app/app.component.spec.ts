import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AuthService } from './core/services/auth.service'

describe('AppComponentTest', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>; // Создаем объект-заглушку для сервиса AuthService
  beforeEach(() => {
    // Создаем объект-заглушку для сервиса AuthService с помощью jasmine.createSpyObj
    authServiceMock = jasmine.createSpyObj('AuthService', ['me']);

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock } // Предоставляем объект-заглушку вместо реального сервиса
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should call AuthService.me() on component initialization', () => {
    fixture.detectChanges();
    expect(authServiceMock.me).toHaveBeenCalled();
  });
});
