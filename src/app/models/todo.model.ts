export class Todo {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly status: TodoStatus,
    public readonly dueDate: Date,
    public readonly done: boolean,
    public readonly location?: TodoLocation
  ) { }
}

export type TodoStatus = 'late' | 'in-progress' | 'closed';

export class TodoLocation {
  constructor(
    public readonly latitude: number,
    public readonly longitude: number
  ) { }
}

export class TodoCreate {
  constructor(
    public readonly title: string,
    public readonly dueDate: Date,
    public readonly latitude: number | null,
    public readonly longitude: number | null
  ) { }
}

export class TodoUpdate {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly dueDate: Date,
    public readonly done: boolean,
    public readonly latitude: number | null,
    public readonly longitude: number | null
  ) { }
}
