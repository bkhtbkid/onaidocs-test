import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import {DocumentsActions, DocumentsEffects, IDocument, IFilterDocuments} from '@app/features';
import { DocumentsService, UiNotificationsService } from '@app/core';

describe('DocumentsEffects', () => {
  let actions$: Observable<any>;
  let effects: DocumentsEffects;
  let documentsService: jasmine.SpyObj<DocumentsService>;
  let notifications: jasmine.SpyObj<UiNotificationsService>;

  beforeEach(() => {
    documentsService = jasmine.createSpyObj('DocumentsService', [
      'getDocumentsList',
      'getDocumentById',
    ]);
    notifications = jasmine.createSpyObj('UiNotificationsService', ['error']);

    TestBed.configureTestingModule({
      providers: [
        DocumentsEffects,
        provideMockActions(() => actions$),
        { provide: DocumentsService, useValue: documentsService },
        { provide: UiNotificationsService, useValue: notifications },
      ],
    });

    effects = TestBed.inject(DocumentsEffects);
  });

  it('loadDocuments$ при ошибке должен диспатчить LoadDocumentsError', (done) => {
    const filters: IFilterDocuments = { page: 1, pageSize: 10 };
    const error = new Error('Network error');

    documentsService.getDocumentsList.and.returnValue(throwError(() => error));

    actions$ = of(DocumentsActions.loadDocuments({ filters }));

    effects.loadDocuments$.subscribe((action) => {
      expect(action).toEqual(
        DocumentsActions.loadDocumentsError({
          error: 'Network error',
        })
      );
      done();
    });
  });

  it('loadDocumentsError$ должен вызывать notifications.error', (done) => {
    const errorAction = DocumentsActions.loadDocumentsError({ error: 'Test Error' });
    actions$ = of(errorAction);

    effects.loadDocumentsError$.subscribe(() => {
      expect(notifications.error).toHaveBeenCalledWith('Test Error');
      done();
    });
  });
});
