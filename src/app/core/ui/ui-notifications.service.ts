import {inject, Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UiNotificationsService {
  private _snackbar = inject(MatSnackBar);

  public success(message: string, duration = 3000) {
    this._snackbar.open(message, "OK", {
      duration,
      horizontalPosition: "right",
      verticalPosition: "top",
      panelClass: ["success-snackbar"]
    });
  }

  public error(message: string, duration = 3000) {
    this._snackbar.open(message, "Закрыть", {
      duration,
      horizontalPosition: "right",
      verticalPosition: "top",
      panelClass: ["error-snackbar"]
    });
  }
}
