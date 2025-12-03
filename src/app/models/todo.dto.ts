export interface TodoDto {
  todoId: number;
  title: string;
  dueDate: string;
  isDone: boolean;
  latitude: null | number;
  longitude: null | number;
}

export interface TodoPatchDto {
  isDone: boolean;
}

export interface TodoPostDto {
  title: string;
  dueDate: string;
  latitude: null | number;
  longitude: null | number;
}

export interface TodoPutDto {
  title: string;
  dueDate: string;
  isDone: boolean;
  latitude: null | number;
  longitude: null | number;
}
