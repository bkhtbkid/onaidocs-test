import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, of, tap} from 'rxjs';
import {DOCUMENTS_API} from '@app/core';
import {IDocument, IFilterDocuments} from '@app/features';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {

  private _http = inject(HttpClient);
  private _docs = signal<IDocument[] | null>(null);
  private readonly _STORAGE_KEY = "mock-docs";

  private _loadInitial() {
    const currentDocs = this._docs();
    if (currentDocs) {
      return of(currentDocs);
    }

    const stored = sessionStorage.getItem(this._STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as IDocument[];
      this._docs.set(parsed);
      return of(parsed);
    }

    return this._http.get<IDocument[]>(DOCUMENTS_API.LIST).pipe(
      tap(
        docs => {
          this._docs.set(docs);
          sessionStorage.setItem(this._STORAGE_KEY, JSON.stringify(docs));
        }
      )
    )
  }

  private _save(next: IDocument[]) {
    this._docs.set(next);
    sessionStorage.setItem((this._STORAGE_KEY), JSON.stringify(next));
  }

  public getDocumentsList(filters?: IFilterDocuments) {
    const search = (filters?.search ?? '').toLowerCase();
    const page = filters?.page && filters.page > 0 ? filters.page : 1;
    const pageSize = filters?.pageSize && filters.pageSize > 0 ? filters.pageSize : 10;
    const status =
      filters?.status && filters.status !== 'ALL' ? filters.status : null;
    const sortDirection = filters?.sortDirection ?? 'desc';

    return this._loadInitial().pipe(
      map((docs) => {
        if (!docs) {
          return {items: [], total: 0};
        }

        let filtered = docs;

        if (search) {
          filtered = filtered.filter((doc) =>
            doc.title.toLowerCase().includes(search),
          );
        }

        if (status) {
          filtered = filtered.filter((doc) => doc.status === status);
        }

        filtered = [...filtered].sort((a, b) => {
          const aTime = new Date(a.updatedAt).getTime();
          const bTime = new Date(b.updatedAt).getTime();

          return sortDirection === 'asc' ? aTime - bTime : bTime - aTime;
        });

        const total = filtered.length;
        const start = (page - 1) * pageSize;
        const items = filtered.slice(start, start + pageSize);

        return {items, total};
      }),
    );
  }

  public getDocumentById(id: number) {
    return this._loadInitial().pipe(
      map(docs => {
        return docs?.find(doc => doc.id === id) ?? null;
      })
    )
  }

  public createDocument(payload: Omit<IDocument, "id" | "updatedAt">) {
    return this._loadInitial().pipe(
      map(docs => {
        const nextId = docs?.length ? Math.max(...docs.map(d => d.id)) + 1 : 1;
        const now = new Date().toISOString();

        const newDoc = {
          id: nextId,
          updatedAt: now,
          ...payload
        };

        const next = [...docs, newDoc];

        this._save(next);

        return newDoc;
      })
    )
  }

  public updateDocument(id: number, payload: Partial<IDocument>) {
    return this._loadInitial().pipe(
      map(docs => {
        const now = new Date().toISOString();
        const next = docs.map(doc =>
          doc.id === id ? {
              ...doc,
              ...payload,
              updatedAt: now,
            }
            : doc);

        this._save(next);

        return next.find(doc => doc.id === id) ?? null;
      })
    )
  }
}
