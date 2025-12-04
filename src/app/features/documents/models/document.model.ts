export type TDocumentStatus = 'DRAFT' | 'SIGNED' | 'ARCHIVED';
export type TSortDirection = 'asc' | 'desc';

export const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Черновик',
  SIGNED: 'Подписан',
  ARCHIVED: 'В архиве',
};

export interface IDocument {
  id: number;
  title: string;
  author: string;
  status: TDocumentStatus;
  updatedAt: string;
  content: string;
}

export interface IFilterDocuments {
  search?: string;
  page?: number;
  pageSize?: number;
  status?: TDocumentStatus | "ALL";
  sortDirection?: TSortDirection;
}

export interface IDocumentState {
  items: IDocument[];
  total: number;
  loading: boolean;
  error: string | null;
  filters: IFilterDocuments;
  selected: IDocument | null;
  selectedLoading: boolean;
  selectedError: string | null;
}

export interface IStatusOption {
  name: string;
  value: string;
}
