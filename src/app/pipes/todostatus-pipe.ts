import { Pipe, PipeTransform } from '@angular/core';
import { TodoStatus } from '../models/todo.model';

@Pipe({
  name: 'todostatus',
})
export class TodostatusPipe implements PipeTransform {

  transform(value: TodoStatus, css?: string): string {
    if (value === 'late') {
      return css === 'bootstrap' ? 'warning' : 'En retard';
    } else if (value === 'in-progress') {
      return css === 'bootstrap' ? 'info' : 'À faire';
    } else if (value === 'closed') {
      return css === 'bootstrap' ? 'secondary' : 'Clôturée';
    }
    return '';
  }
}
