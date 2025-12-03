import { Component, computed, inject, signal } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { TodolistItemComponent } from "../todolist-item/todolist-item.component";
import { Todo } from '../../models/todo.model';
import { TodoUpdateComponent } from "../todo-update/todo-update.component";

@Component({
  selector: 'app-todolist',
  imports: [TodolistItemComponent, TodoUpdateComponent],
  templateUrl: './todolist.component.html',
  styleUrl: './todolist.component.css',
})
export class TodolistComponent {
  private readonly todoService = inject(TodoService);

  protected readonly allTodos = computed(() => {
    let todos = this.todoService.todos().slice();

    if (this.currentFilter()) {
      todos = todos.filter((t) =>
        t.title
          .toLowerCase()
          .includes(this.currentFilter().toLowerCase())
      );
    }

    switch (this.currentSort()) {
      case 'title':
        todos.sort((t1, t2) => t1.title.localeCompare(t2.title));
        break;
      case 'dueDate':
        todos.sort((t1, t2) => t2.dueDate.getTime() - t1.dueDate.getTime());
        break;
      case 'done':
        todos.sort((t1, t2) => +t2.done - +t1.done);
        break;
    }

    return todos;
  });

  constructor() {
    this.todoService.listAll();
  }

  protected readonly currentSort = signal<SortKey | null>(null);
  protected readonly isSorted = computed(() => this.currentSort() != null);

  protected sortBy(key: SortKey) {
    this.currentSort.set(key != this.currentSort() ? key : null);
  }

  protected readonly currentFilter = signal<string>('');
  protected readonly isFiltered = computed(() => this.currentFilter() != '');
  protected readonly countFiltered = computed(() => this.allTodos().length);

  protected filterBy(keyword: string) {
    this.currentFilter.set(keyword);
  }

  protected toggleIt(todo: Todo) { this.todoService.toggle(todo); }

  protected deleteIt(todo: Todo) { this.todoService.delete(todo); }

  protected readonly selectedTodo = signal<Todo | undefined>(undefined);

  protected updateIt(todo: Todo) { this.selectedTodo.set(todo); }
}

export type SortKey = 'title' | 'dueDate' | 'done';
