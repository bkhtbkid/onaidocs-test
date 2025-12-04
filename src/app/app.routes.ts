import { Routes } from '@angular/router';
import {authGuard, MainLayoutComponent} from '@app/core';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('@app/features/auth/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: '',
    canActivate: [authGuard],
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'documents',
      },
      {
        path: 'documents',
        loadComponent: () =>
          import(
            '@app/features/documents/pages/documents-list/documents-list.component'
            ).then((m) => m.DocumentsListComponent),
      },
      {
        path: 'documents/:id',
        loadComponent: () =>
          import(
            '@app/features/documents/pages/documents-list/documents-list.component'
            ).then((m) => m.DocumentsListComponent),
      }
    ]
  },

  { path: '**', redirectTo: 'documents' },
];
