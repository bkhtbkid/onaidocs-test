import { Pipe, PipeTransform } from '@angular/core';
import {STATUS_LABELS} from '@app/features';

@Pipe({
  name: 'statusLabel',
  standalone: true
})
export class StatusLabelPipe implements PipeTransform {

  transform(value: string | null | undefined): string {
    if (!value) return '';
    return STATUS_LABELS[value] ?? value;
  }

}
