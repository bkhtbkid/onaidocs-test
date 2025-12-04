import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AuthService} from '@app/core';
import {MatSnackBarModule} from '@angular/material/snack-bar';

@Component({
  selector: 'main-layout',
  templateUrl: './main-layout.component.html',
  imports: [
    RouterOutlet,
    MatSnackBarModule
  ],
  standalone: true
})
export class MainLayoutComponent {
  private _authService = inject(AuthService);
  public me = this._authService.me();

  onExit() {
    this._authService.logout();
  }
}
