import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import {AuthService, UiNotificationsService} from '@app/core';

describe('AuthService', () => {
  let service: AuthService;
  let router: jasmine.SpyObj<Router>;
  let notifications: jasmine.SpyObj<UiNotificationsService>;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    notifications = jasmine.createSpyObj('UiNotificationsService', ['success']);

    sessionStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useValue: router },
        { provide: UiNotificationsService, useValue: notifications },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  it('должен сохранять токен и пользователя при login', fakeAsync(() => {
    const body = { login: 'baha', password: '123' };

    service.login(body).subscribe();
    tick(500);

    expect(sessionStorage.getItem('ACCESS_TOKEN_KEY')).toBe('FAKE_TOKEN_KEY');
    expect(service.me()).toEqual({ name: 'baha' });
    expect(notifications.success).toHaveBeenCalledWith('Успешный вход');
  }));

  it('isLoggedIn должен зависеть от наличия токена', fakeAsync(() => {
    expect(service.isLoggedIn()).toBeFalse();

    service.login({ login: 'user', password: '123' }).subscribe();
    tick(500);

    expect(service.isLoggedIn()).toBeTrue();

    service.logout();
    expect(service.isLoggedIn()).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  }));
});
