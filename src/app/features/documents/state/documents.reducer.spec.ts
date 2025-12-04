import {DocumentsActions, documentsFeatureReducer, IDocument} from '@app/features';
import { IFilterDocuments, TDocumentStatus } from '@app/features';

describe('documents reducer', () => {
  function createInitialState() {
    return documentsFeatureReducer(undefined as any, { type: '@@init' } as any);
  }

  it('LoadDocuments должен включать loading и сохранять фильтры', () => {
    const state = createInitialState();

    const filters: IFilterDocuments = {
      search: 'протокол',
      page: 2,
      pageSize: 5,
      status: 'SIGNED' as TDocumentStatus,
    };

    const next = documentsFeatureReducer(
      state,
      DocumentsActions.loadDocuments({ filters }),
    );

    expect(next.loading).toBeTrue();
    expect(next.error).toBeNull();

    expect(next.filters.search).toBe('протокол');
    expect(next.filters.page).toBe(2);
    expect(next.filters.pageSize).toBe(5);
    expect(next.filters.status).toBe('SIGNED');
  });

  it('LoadDocumentsSuccess должен выключать loading и записывать items/total', () => {
    const state = createInitialState();

    const loadingState = documentsFeatureReducer(
      state,
      DocumentsActions.loadDocuments({ filters: { page: 1, pageSize: 10 } }),
    );

    const items: IDocument[] = [
      {
        id: 1,
        title: 'Документ 1',
        author: 'Автор',
        status: 'DRAFT',
        updatedAt: '2025-01-01T00:00:00.000Z',
        content: 'Текст',
      },
    ];

    const next = documentsFeatureReducer(
      loadingState,
      DocumentsActions.loadDocumentsSuccess({ items, total: 1 }),
    );

    expect(next.loading).toBeFalse();
    expect(next.items).toEqual(items);
    expect(next.total).toBe(1);
  });

  it('LoadDocumentSuccess должен устанавливать selected', () => {
    const state = createInitialState();

    const doc = {
      id: 42,
      title: 'Selected',
      author: 'Автор',
      status: 'SIGNED' as TDocumentStatus,
      updatedAt: '2025-02-02T00:00:00.000Z',
      content: 'Текст',
    };

    const next = documentsFeatureReducer(
      state,
      DocumentsActions.loadDocumentSuccess({ document: doc }),
    );

    expect(next.selected).toEqual(doc);
    expect(next.selectedLoading).toBeFalse();
    expect(next.selectedError).toBeNull();
  });
});
