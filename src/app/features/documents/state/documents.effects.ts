import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {DocumentsService, UiNotificationsService} from '@app/core';
import {DocumentsActions} from '@app/features';
import {catchError, map, of, switchMap, tap} from 'rxjs';

@Injectable()
export class DocumentsEffects {
  private _actions$ = inject(Actions);
  private _documentsService = inject(DocumentsService);
  private _uiNotifications = inject(UiNotificationsService);

  loadDocuments$ = createEffect(() =>
    this._actions$.pipe(
      ofType(DocumentsActions.loadDocuments),
      switchMap(({ filters }) =>
        this._documentsService.getDocumentsList(filters).pipe(
          map((res) => {
            return DocumentsActions.loadDocumentsSuccess({
              items: res.items,
              total: res.total,
            });
          }),
          catchError((error) =>
            of(
              DocumentsActions.loadDocumentsError({
                error: error?.message ?? 'Ошибка загрузки документов',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loadDocument$ = createEffect(() =>
    this._actions$.pipe(
      ofType(DocumentsActions.loadDocument),
      switchMap(({ id }) =>
        this._documentsService.getDocumentById(id).pipe(
          map((doc) => {
            if (!doc) {
              return DocumentsActions.loadDocumentError({
                error: 'Документ не найден',
              });
            }
            return DocumentsActions.loadDocumentSuccess({ document: doc });
          }),
          catchError((error) =>
            of(
              DocumentsActions.loadDocumentError({
                error: error?.message ?? 'Ошибка загрузки документа',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loadDocumentsError$ = createEffect(
    () =>
      this._actions$.pipe(
        ofType(DocumentsActions.loadDocumentsError),
        tap(({ error }) => {
          this._uiNotifications.error(error);
        }),
      ),
    { dispatch: false },
  );
}
