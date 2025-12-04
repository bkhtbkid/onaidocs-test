import {ChangeDetectionStrategy, Component, forwardRef, input, signal} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {MatError, MatFormField, MatInput, MatLabel, MatSuffix} from '@angular/material/input';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'ui-input',
  templateUrl: './ui-input.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UIInputComponent),
      multi: true
    }
  ],
  imports: [
    MatLabel,
    MatInput,
    MatError,
    MatSuffix,
    MatIconButton,
    MatIcon,
    MatFormField,
  ]
})
export class UIInputComponent implements ControlValueAccessor {
  type = input<"text" | "password" | "email">("text");
  label = input("");
  placeholder = input("");
  error = input<string | null>(null);
  canUpdate = input(false)

  public value: string | null = null;
  public hidePassword = signal(true);

  private onChange: (value: string | null) => void = () => {};
  public onTouched: () => void = () => {};

  writeValue(value: string | null): void {
    this.value = value;
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onInputChange(event: Event) {
    this.value = (event.target as HTMLInputElement).value;
    this.onChange(this.value);
  }

  onBlur() {
    this.onTouched();
  }

  onHidePasswordToggleClick() {
    this.hidePassword.set(!this.hidePassword());
  }
}
