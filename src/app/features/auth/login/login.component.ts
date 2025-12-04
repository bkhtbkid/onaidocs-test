import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UIInputComponent} from '@app/shared';
import {AuthService} from '@app/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    ReactiveFormsModule,
    UIInputComponent,
  ],
  standalone: true
})
export class LoginComponent {
  public isSubmitted = false;

  public form: FormGroup = new FormGroup({
    login: new FormControl("", Validators.required),
    password: new FormControl("", [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/^[ -~]*$/)
    ]),
  });

  private _authService = inject(AuthService);
  private _router = inject(Router);

  get passwordErrorMessage(): string | null {
    const control = this.form.get('password');
    if (control && control.invalid && (control.dirty || control.touched || this.isSubmitted)) {
      if (control.hasError('required')) return 'Пароль обязателен';
      if (control.hasError('minlength')) return `Минимум ${control.errors?.['minlength'].requiredLength} символов`;
      if (control.hasError('pattern')) return 'Только латинские буквы и цифры';
    }
    return null;
  }

  get loginErrorMessage(): string | null {
    const control = this.form.get('login');
    if (control && control.invalid && (control.touched || control.dirty || this.isSubmitted)) {
      if (control.hasError('required')) return 'Логин обязателен';
    }
    return null;
  }

  onSubmit() {
    this.isSubmitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this._authService.login(this.form.value).subscribe(() => {
      this._router.navigate(["/documents"]);
    });
  }
}
