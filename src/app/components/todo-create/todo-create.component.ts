import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InfotelValidators } from '../../utils/infotel-validators';
import { DatePipe } from '@angular/common';
import { TodoService } from '../../services/todo.service';
import { TodoCreate } from '../../models/todo.model';

@Component({
  selector: 'app-todo-create',
  imports: [FormsModule, ReactiveFormsModule, DatePipe],
  templateUrl: './todo-create.component.html',
  styleUrl: './todo-create.component.css',
})
export class TodoCreateComponent {
  private readonly todoService = inject(TodoService);

  fieldTitle!: FormControl;
  fieldDueDate!: FormControl;
  fieldLatitude!: FormControl;
  fieldLongitude!: FormControl;
  groupCreate!: FormGroup;

  private initFields() {
    let today = new Date().toISOString().split('T')[0];
    this.fieldTitle = new FormControl('', [Validators.required, Validators.minLength(3)]);
    this.fieldDueDate = new FormControl(today, [Validators.required, InfotelValidators.minDate(new Date(today))]);
    this.fieldLatitude = new FormControl(null, [Validators.min(-90), Validators.max(90)]);
    this.fieldLongitude = new FormControl(null, [Validators.min(-180), Validators.max(180)]);

    this.fieldLatitude.addValidators(InfotelValidators.requiredWith(this.fieldLongitude));
    this.fieldLongitude.addValidators(InfotelValidators.requiredWith(this.fieldLatitude));

    this.fieldLatitude.valueChanges.subscribe(v => this.fieldLongitude.updateValueAndValidity({ emitEvent: false }));
    this.fieldLongitude.valueChanges.subscribe(v => this.fieldLatitude.updateValueAndValidity({ emitEvent: false }));

    this.groupCreate = new FormGroup({
      title: this.fieldTitle,
      dueDate: this.fieldDueDate,
      latitude: this.fieldLatitude,
      longitude: this.fieldLongitude
    })
  }

  constructor() {
    this.initFields();
  }

  buttonClose = viewChild<ElementRef<HTMLButtonElement>>('btnClose');
  saveNewTodo() {
    this.groupCreate.markAllAsTouched();

    if (this.groupCreate.valid) {
      let todoToCreate = new TodoCreate(
        this.fieldTitle.value,
        new Date(this.fieldDueDate.value),
        this.fieldLatitude.value,
        this.fieldLongitude.value
      );

      this.todoService.create(todoToCreate);
      this.initFields();
      this.buttonClose()?.nativeElement.click();
    }
  }
}
