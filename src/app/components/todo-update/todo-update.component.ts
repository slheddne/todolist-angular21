import { Component, effect, ElementRef, inject, input, viewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InfotelValidators } from '../../utils/infotel-validators';
import { DatePipe } from '@angular/common';
import { TodoService } from '../../services/todo.service';
import { Todo, TodoUpdate } from '../../models/todo.model';

@Component({
  selector: 'app-todo-update',
  imports: [FormsModule, ReactiveFormsModule, DatePipe],
  templateUrl: './todo-update.component.html',
  styleUrl: './todo-update.component.css'
})
export class TodoUpdateComponent {
  private readonly todoService = inject(TodoService);

  todoToEdit = input<Todo | undefined>(undefined);

  fieldTitle!: FormControl;
  fieldDueDate!: FormControl;
  fieldLatitude!: FormControl;
  fieldLongitude!: FormControl;
  groupUpdate!: FormGroup;

  private initFields(todo?: Todo) {
    const today = new Date().toISOString().split('T')[0];
    let dueDateStr = today;

    if (todo) {
      const date = todo.dueDate;
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      dueDateStr = `${year}-${month}-${day}`;
    }

    this.fieldTitle = new FormControl(todo?.title ?? '', [Validators.required, Validators.minLength(3)]);
    this.fieldDueDate = new FormControl(dueDateStr, [Validators.required, InfotelValidators.minDate(new Date())]);
    this.fieldLatitude = new FormControl(todo?.location?.latitude ?? null, [Validators.min(-90), Validators.max(90)]);
    this.fieldLongitude = new FormControl(todo?.location?.longitude ?? null, [Validators.min(-180), Validators.max(180)]);

    this.fieldLatitude.addValidators(InfotelValidators.requiredWith(this.fieldLongitude));
    this.fieldLongitude.addValidators(InfotelValidators.requiredWith(this.fieldLatitude));

    this.fieldLatitude.valueChanges.subscribe(v => this.fieldLongitude.updateValueAndValidity({ emitEvent: false }));
    this.fieldLongitude.valueChanges.subscribe(v => this.fieldLatitude.updateValueAndValidity({ emitEvent: false }));

    this.groupUpdate = new FormGroup({
      title: this.fieldTitle,
      dueDate: this.fieldDueDate,
      latitude: this.fieldLatitude,
      longitude: this.fieldLongitude
    });
  }

  constructor() {
    this.initFields();

    effect(() => {
      const todo = this.todoToEdit();
      if (todo) {
        this.initFields(todo);
      }
    });
  }

  buttonClose = viewChild<ElementRef<HTMLButtonElement>>('btnClose');

  saveUpdatedTodo() {
    const todo = this.todoToEdit();
    if (!todo) return;

    this.groupUpdate.markAllAsTouched();

    if (this.groupUpdate.valid) {
      const todoToUpdate = new TodoUpdate(
        todo.id,
        this.fieldTitle.value,
        new Date(this.fieldDueDate.value),
        todo.done,
        this.fieldLatitude.value,
        this.fieldLongitude.value
      );

      this.todoService.update(todoToUpdate);
      this.buttonClose()?.nativeElement.click();
    }
  }
}
