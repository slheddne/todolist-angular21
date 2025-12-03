import { Component, input, output } from '@angular/core';
import { Todo } from '../../models/todo.model';
import { DatePipe, NgClass, UpperCasePipe } from '@angular/common';
import { TodostatusPipe } from '../../pipes/todostatus-pipe';
import { TodolocationPipe } from '../../pipes/todolocation-pipe';
import { OpenTabDirective } from '../../directives/open-tab.directive';

@Component({
  selector: 'app-todolist-item',
  imports: [
    DatePipe,
    NgClass,
    TodostatusPipe,
    UpperCasePipe,
    TodolocationPipe,
    OpenTabDirective
  ],
  templateUrl: './todolist-item.component.html',
  styleUrl: './todolist-item.component.css',
})
export class TodolistItemComponent {
  todoItem = input.required<Todo>();
  toggling = output<Todo>();
  deleting = output<Todo>();
  updating = output<Todo>();
}
