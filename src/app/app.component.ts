import { Component, computed, effect, inject } from '@angular/core';
import { TodolistComponent } from "./components/todolist/todolist.component";
import { TodoService } from './services/todo.service';
import { TodoProgressComponent } from "./components/todo-progress/todo-progress.component";
import { TodoCreateComponent } from "./components/todo-create/todo-create.component";

@Component({
  selector: 'app-root',
  imports: [TodolistComponent, TodoProgressComponent, TodoCreateComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private readonly todoService = inject(TodoService);
  protected readonly total = computed(() => this.todoService.todos().length);

  constructor() {
    this.todoService.listAll();
    effect(() => {
      let error = this.todoService.lastError();
      if (error) {
        alert(error);
      }
    });
  }
}
