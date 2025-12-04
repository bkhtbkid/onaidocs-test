import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from '@app/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getToken();

  let headers = req.headers;

  const lang = navigator.language || 'ru-RU';
  headers = headers.set('Accept-Language', lang);

  if (!req.url.endsWith('/auth/login') && token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  const cloned = req.clone({ headers });

  return next(cloned);
}
