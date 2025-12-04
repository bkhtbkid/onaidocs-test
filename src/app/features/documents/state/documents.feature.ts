import {createFeature, createReducer, on} from '@ngrx/store';
import {DocumentsActions, IDocumentState} from '@app/features';

const initialState: IDocumentState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
  filters: {
    page: 1,
    pageSize: 10,
    search: "",
    status: "ALL"
  },
  selected: null,
  selectedLoading: false,
  selectedError: null,
};

const reducer = createReducer(
  initialState,
  on(DocumentsActions.loadDocuments, (state, { filters }) => ({
    ...state,
    loading: true,
    error: null,
    filters: {
      ...state.filters,
      ...filters
    },
  })),

  on(DocumentsActions.loadDocumentsSuccess, (state, { items, total }) => ({
    ...state,
    items,
    total,
    loading: false,
  })),

  on(DocumentsActions.loadDocumentsError, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(DocumentsActions.loadDocument, (state) => ({
    ...state,
    selectedLoading: true,
    selectedError: null,
  })),

  on(DocumentsActions.loadDocumentSuccess, (state, { document }) => ({
    ...state,
    selected: document,
    selectedLoading: false,
    selectedError: null,
  })),

  on(DocumentsActions.loadDocumentError, (state, { error }) => ({
    ...state,
    selectedLoading: false,
    selectedError: error,
  })),

  on(DocumentsActions.clearSelectedDocument, (state) => ({
    ...state,
    selected: null,
    selectedLoading: false,
    selectedError: null,
  })),
);

export const documentsFeature = createFeature({
  name: "documents",
  reducer
});

export const {
  name: documentsFeatureKey,
  reducer: documentsFeatureReducer,
  selectItems,
  selectTotal,
  selectLoading,
  selectFilters,
} = documentsFeature;
