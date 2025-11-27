import { Component, computed, inject } from '@angular/core';
import { TodostatusPipe } from '../../pipes/todostatus-pipe';
import { NgClass, PercentPipe } from '@angular/common';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todo-progress',
  imports: [TodostatusPipe, NgClass, PercentPipe],
  templateUrl: './todo-progress.component.html',
  styleUrl: './todo-progress.component.css',
})
export class TodoProgressComponent {
  private readonly todoService = inject(TodoService);
  protected readonly rate = computed(() => {
    const todos = this.todoService.todos();
    return {
      closed: todos.filter((t) => t.status === 'closed').length / todos.length,
      inProgress: todos.filter((t) => t.status === 'in-progress').length / todos.length,
      late: todos.filter((t) => t.status === 'late').length / todos.length,
    }
  })

}
