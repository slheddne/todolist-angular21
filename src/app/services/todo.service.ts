import { inject, Injectable, signal } from '@angular/core';
import { Todo, TodoLocation, TodoStatus, TodoCreate, TodoUpdate } from '../models/todo.model';
import { TodoDto, TodoPatchDto, TodoPostDto, TodoPutDto } from '../models/todo.dto';
import { map } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:44444';

  private mapDtoToModel(dto: TodoDto): Todo {
    let dueDate = new Date(dto.dueDate);
    let status: TodoStatus = 'closed';
    let location: TodoLocation | undefined;

    if (dto.latitude !== null && dto.longitude !== null) {
      location = new TodoLocation(dto.latitude, dto.longitude);
    }

    if (!dto.isDone) {
      status = dueDate.getTime() > new Date().getTime() ? 'in-progress' : 'late';
    }

    return new Todo(
      dto.todoId,
      dto.title,
      status,
      dueDate,
      dto.isDone,
      location
    );
  }

  private todosState = signal<readonly Todo[]>([]); // Astuce : Readonly pour éviter de modifier le tableau
  public todos = this.todosState.asReadonly();

  private lastGet?: Date;

  listAll(): void {
    if (this.lastGet && new Date().getTime() - this.lastGet.getTime() < 1000 * 10)
      return;

    this.lastGet = new Date();

    this.http.get<TodoDto[]>(`${this.baseUrl}/todo`)
      .pipe(
        map((dtos) => dtos.map((dto) => this.mapDtoToModel(dto)))
      )
      .subscribe(todos => this.todosState.set(todos));
  }

  toggle(todo: Todo): void {
    let body: TodoPatchDto = {
      isDone: !todo.done
    };

    this.http
      .patch<TodoDto>(`${this.baseUrl}/todo/${todo.id}`, body)
      .pipe(
        map((dto) => this.mapDtoToModel(dto))
      )
      .subscribe((toggledTodo) =>
        this.todosState.update(todos => todos.map(t => t.id === toggledTodo.id ? toggledTodo : t))
      );
  }

  private _lastError = signal<string>('');
  public lastError = this._lastError.asReadonly();

  delete(todoToDelete: Todo): void {
    this._lastError.set('');

    if (!todoToDelete.done) {
      this._lastError.set('😔 Impossible de supprimer une tâche non terminée.');
      return;
    }

    this.http
      .delete(`${this.baseUrl}/todo/${todoToDelete.id}`)
      .pipe(
        map(() => todoToDelete)
      )
      .subscribe({
        next: deletedTodo => this.todosState.update(todos => todos.filter(t => t.id !== deletedTodo.id)),
        error: httpError => this._lastError.set('😔 Impossible de supprimer : ' + this.mapHttpErrorToMessage(httpError))
      });
  }

  private mapHttpErrorToMessage(error: HttpErrorResponse): string {
    let message = '';

    if (error.status === HttpStatusCode.BadRequest) message = 'Les données transmises sont invalides.';
    if (error.status === HttpStatusCode.Unauthorized) message = 'Il faut être authentifié.';
    if (error.status === HttpStatusCode.NotFound) message = "La tâche n'existe pas.";
    if (error.status === HttpStatusCode.Forbidden) message = "Vous n'avez pas les droits suffisants pour cette action.";
    if (error.status === HttpStatusCode.InternalServerError) message = 'Réessayez un peu plus tard, le serveur a rencontré une erreur.';

    return message;
  }

  create(todoCreate: TodoCreate) {
    this._lastError.set('');

    let body: TodoPostDto = {
      title: todoCreate.title,
      dueDate: todoCreate.dueDate.toISOString(),
      latitude: todoCreate.latitude,
      longitude: todoCreate.longitude
    };

    this.http
      .post<TodoDto>(`${this.baseUrl}/todo`, body)
      .pipe(
        map((dto) => this.mapDtoToModel(dto))
      )
      .subscribe({
        next: createdTodo => this.todosState.update(todos => [...todos, createdTodo]),
        error: httpError => this._lastError.set('😔 Impossible de créer la tâche : ' + this.mapHttpErrorToMessage(httpError))
      });
  }

  update(todoToUpdate: TodoUpdate) {
    this._lastError.set('');

    let body: TodoPutDto = {
      title: todoToUpdate.title,
      dueDate: todoToUpdate.dueDate.toISOString(),
      latitude: todoToUpdate.latitude,
      longitude: todoToUpdate.longitude
    };

    this.http
      .put<TodoDto>(`${this.baseUrl}/todo/${todoToUpdate.id}`, body)
      .pipe(
        map((dto) => this.mapDtoToModel(dto))
      )
      .subscribe({
        next: updatedTodo => this.todosState.update(todos => todos.map(t => t.id === updatedTodo.id ? updatedTodo : t)),
        error: httpError => this._lastError.set('😔 Impossible de mettre à jour la tâche : ' + this.mapHttpErrorToMessage(httpError))
      });
  }
}
