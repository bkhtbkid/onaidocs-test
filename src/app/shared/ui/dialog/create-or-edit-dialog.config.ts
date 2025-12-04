import {MatDialogConfig} from '@angular/material/dialog';


export const BASE_DIALOG_CONFIG: MatDialogConfig = {
  width: "31.25rem",
  maxWidth: "100%",
  height: "100%",
  position: {
    right: "0",
    top: "0",
  },
  panelClass: "ui-dialog",
  closeOnNavigation: true,
  hasBackdrop: true,
  disableClose: false,
}
