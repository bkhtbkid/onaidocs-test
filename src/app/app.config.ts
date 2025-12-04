import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {provideStore} from '@ngrx/store';
import {DocumentsEffects, documentsFeatureKey, documentsFeatureReducer} from '@app/features';
import {provideEffects} from '@ngrx/effects';
import {authInterceptor} from '@app/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore({
      [documentsFeatureKey]: documentsFeatureReducer,
    }),
    provideEffects([DocumentsEffects]),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
