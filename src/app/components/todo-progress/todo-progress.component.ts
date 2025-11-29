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
  protected readonly stats = computed(() => {
    const todos = this.todoService.todos();
    const total = todos.length;

    const closed = todos.filter((t) => t.status === 'closed').length;
    const inProgress = todos.filter((t) => t.status === 'in-progress').length;
    const late = todos.filter((t) => t.status === 'late').length;

    return {
      total,
      counts: { closed, inProgress, late },
      rates: {
        closed: closed / total || 0,
        inProgress: inProgress / total || 0,
        late: late / total || 0,
      },
    };
  });
}
