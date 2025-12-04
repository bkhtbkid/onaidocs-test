import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DatePipe, NgClass} from '@angular/common';
import {debounceTime, distinctUntilChanged, map} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {Store} from '@ngrx/store';
import {
  CreateOrEditDocumentDialog,
  DocumentsActions,
  TDocumentStatus,
  IDocument,
  IFilterDocuments, selectFilters,
  selectItems,
  selectLoading,
  selectTotal, TSortDirection
} from '@app/features';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {BASE_DIALOG_CONFIG, StatusLabelPipe} from '@app/shared';

@Component({
  selector: 'documents-list',
  templateUrl: './documents-list.component.html',
  imports: [
    NgClass,
    DatePipe,
    ReactiveFormsModule,
    FormsModule,
    StatusLabelPipe
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentsListComponent implements OnInit {

  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _store = inject(Store);
  private _dialog = inject(MatDialog);
  private _dialogRef?: MatDialogRef<CreateOrEditDocumentDialog | null>;

  readonly statuses = [
    "ALL",
    "DRAFT",
    "SIGNED",
    "ARCHIVED",
  ];

  readonly pageSizeOptions = [5, 10, 20, 50];

  readonly list = toSignal(this._store.select(selectItems), {
    initialValue: [] as IDocument[]
  });

  readonly total = toSignal(this._store.select(selectTotal), {
    initialValue: 0
  });

  readonly filters = toSignal(this._store.select(selectFilters, {
    initialValue: {
      page: 1,
      pageSize: 10,
      search: "",
      status: "ALL",
      sortDirection: 'desc' as TSortDirection,
    }
  }));

  readonly status = signal<TDocumentStatus | "ALL">("ALL");

  public searchControl = new FormControl("");

  ngOnInit(): void {
    this._route.queryParamMap.pipe(
      map((params): IFilterDocuments => {
        const search = params.get("search") ?? "";
        const page = Number(params.get("page")) || 1;
        const pageSize = Number(params.get("pageSize")) || 10;
        const status = params.get("status") as TDocumentStatus | "ALL" ?? "ALL";
        const sortDirection =
          (params.get('sortDirection') as TSortDirection | null) ?? 'desc';

        return {
          search,
          page,
          pageSize,
          status,
          sortDirection,
        };
      }),
      distinctUntilChanged((a, b) => {
        return JSON.stringify(a) === JSON.stringify(b);
      })
    ).subscribe(filters => {
      this.status.set(filters.status ?? "ALL");
      this.searchControl.setValue(filters.search ?? "", {emitEvent: false});

      this._store.dispatch(DocumentsActions.loadDocuments({filters}))
    });

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((value) => {
      this._updateQueryParams({
        search: value ?? "",
        page: 1
      })
    })
  }

  private _updateQueryParams(partial: Partial<IFilterDocuments>) {
    const current = this._route.snapshot.queryParams;

    this._router.navigate([], {
      relativeTo: this._route,
      queryParams: {
        ...current,
        ...partial
      },
      queryParamsHandling: "merge"
    })
  }

  get page() {
    return this.filters()?.page ?? 1;
  }

  get pageSize() {
    return this.filters()?.pageSize ?? 10;
  }

  get sortDirection(): TSortDirection {
    return this.filters()?.sortDirection ?? 'desc';
  }

  public onStatusChange(event: Event) {
    const status = (event.target as HTMLSelectElement).value as TDocumentStatus | "ALL";
    this.status.set(status);
    this._updateQueryParams({
      status,
      page: 1
    })
  }

  public onNextPage() {
    const maxPage = Math.ceil(this.total() / this.pageSize);
    if (this.page < maxPage) {
      this._updateQueryParams({ page: this.page + 1 })
    }
  }

  public onPrevPage() {
    if (this.page > 1) {
      this._updateQueryParams({ page: this.page - 1 })
    }
  }

  public onPageSizeChange(event: Event) {
    const newPageSize = parseInt((event.target as HTMLSelectElement).value, 10);
    this._updateQueryParams({
      pageSize: newPageSize,
      page: 1
    })
  }

  public getPageCount() {
    const total = this.total();
    return total > 0 ? Math.ceil(total / this.pageSize) : 1;
  }

  public onDocument(document: IDocument) {
    this._store.dispatch(
      DocumentsActions.loadDocumentSuccess({ document })
    );
    const filters = this._route.snapshot.queryParams as IFilterDocuments;

    const dialogRef = this._dialog.open(CreateOrEditDocumentDialog, {
      ...BASE_DIALOG_CONFIG,
      data: document,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._store.dispatch(DocumentsActions.loadDocuments({ filters }));
      }
    });
  }

  public onCreateDocument() {
    this._dialogRef = this._dialog.open(CreateOrEditDocumentDialog, {
      ...BASE_DIALOG_CONFIG,
    });

    this._dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      const filters = this._route.snapshot.queryParams as IFilterDocuments;
      this._store.dispatch(DocumentsActions.loadDocuments({ filters }));
    });
  }

  public onToggleDateSort() {
    const current = this.filters();
    const currentDirection = current?.sortDirection ?? 'desc';

    const nextDirection: TSortDirection =
      currentDirection === 'asc' ? 'desc' : 'asc';

    this._updateQueryParams({
      sortDirection: nextDirection,
    });
  }
}
