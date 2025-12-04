import {Component, inject, signal} from '@angular/core';
import {DocumentsService, UiNotificationsService} from '@app/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {IDocument, IStatusOption} from '@app/features';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'create-or-edit-document',
  templateUrl: './create-or-edit-document.dialog.html',
  imports: [
    ReactiveFormsModule
  ],
  standalone: true
})
export class CreateOrEditDocumentDialog {
  private _fb = inject(FormBuilder);
  private _documentService = inject(DocumentsService);
  private _data = inject<IDocument>(MAT_DIALOG_DATA);
  private _dialogRef = inject(MatDialogRef<CreateOrEditDocumentDialog | null>);
  private _uiNotificationService = inject(UiNotificationsService);

  public readonly statuses: IStatusOption[] = [
    {
      name: "Черновик",
      value: "DRAFT",
    },
    {
      name: "Подписан",
      value: "SIGNED",
    },
    {
      name: "В архиве",
      value: "ARCHIVED",
    },
  ];

  public createOrEditForm = this._fb.nonNullable.group({
    title: [this._data?.title ?? '', [Validators.required]],
    author: [this._data?.author ?? '', [Validators.required]],
    status: [this._data?.status ?? 'DRAFT', [Validators.required]],
    content: [this._data?.content ?? '', [Validators.required]],
  });

  public givenDocument = signal<IDocument | null>(this._data ?? null);

  get isEdit() {
    return !!this.givenDocument();
  }

  public onSubmit() {
    if (this.createOrEditForm.invalid) return;

    const value = this.createOrEditForm.getRawValue();

    if (this.isEdit) {
      const doc = this.givenDocument()!;
      this._documentService
        .updateDocument(doc.id, value)
        .subscribe({
          next: updated => {
            this._uiNotificationService.success("Документ обновлен");
            this._dialogRef.close(updated);
          },
          error: () => {
            this._uiNotificationService.error("Не удалось обновить документ");
          }
        });
    } else {
      this._documentService
        .createDocument(value as Omit<IDocument, 'id'>)
        .subscribe({
          next: created => {
            this._uiNotificationService.success("Документ создан")
            this._dialogRef.close(created);
          },
          error: () => {
            this._uiNotificationService.error("Ошибка при создании документа")
          }
        });
    }
  }

  public onCloseMatDialog() {
    this._dialogRef.close();
  }
}
