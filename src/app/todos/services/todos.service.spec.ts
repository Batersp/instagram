import { TodosService } from './todos.service';
import { fakeAsync, TestBed, tick } from '@angular/core/testing'
import { LoggerService } from '../../logger.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { DomainTodo, Todo } from '../models/todos.models'

describe('TodosService', () => {
  let toDoService: TodosService;
  let httpMock: HttpTestingController;
  let loggerService: LoggerService;

  const fakeLoggerService = jasmine.createSpyObj(['log']);
  const fakeEnvironment = {
    production: false,
    baseUrl: 'https://social-network.samuraijs.com/api/1.1',
    apiKey: '80c2f1d7-1a54-48d1-9219-ce9ef5aae102',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TodosService,
        { provide: LoggerService, useValue: fakeLoggerService },
        { provide: environment, useValue: fakeEnvironment },
      ],
    });
    toDoService = TestBed.inject(TodosService);
    httpMock = TestBed.inject(HttpTestingController);
    loggerService = TestBed.inject(LoggerService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(toDoService).toBeTruthy();
  });

  it('getTodos() should get request',fakeAsync(() => {
    toDoService.getTodos();
    const req = httpMock.expectOne(`${fakeEnvironment.baseUrl}/todo-lists`);
    tick();
    expect(req.request.method).toBe('GET');
  }));

  it('getToDo should return newTodos', fakeAsync(() => {
    const toDos: Todo[] = [{id: '1', title: 'test', addedDate: '01.01.2023',order: 5 }];
    const newToDos: DomainTodo[] = [{id: '1', title: 'test', addedDate: '01.01.2023',order: 5, filter: 'all' }];
    spyOn(toDoService.todos$, 'next');
    toDoService.getTodos();
    const req = httpMock.expectOne(`${fakeEnvironment.baseUrl}/todo-lists`);
    req.flush(toDos);
    tick();
    expect(toDoService.todos$.next).toHaveBeenCalledWith(newToDos)
  }));

  it('addTodo() should post request', fakeAsync(() => {
    toDoService.addTodo('newTest');
    const req = httpMock.expectOne(`${fakeEnvironment.baseUrl}/todo-lists`);
    tick();
    expect(req.request.method).toBe('POST');
  }));

  it('addTodo() should return new ToDo State', fakeAsync(() => {
    const initialStateTodos: DomainTodo[] = [{id: '1', title: 'test', addedDate: '01.01.2023',order: 5, filter: 'all' }];
    const newToDo: DomainTodo = {id: '2', title: 'newTest', addedDate: '18.07.2023',order: 6, filter: 'all' };
    const newStateTodos: DomainTodo[] = [
      {id: '2', title: 'newTest', addedDate: '18.07.2023',order: 6, filter: 'all' },
      {id: '1', title: 'test', addedDate: '01.01.2023',order: 5, filter: 'all' },
    ];
    toDoService.todos$.next(initialStateTodos);
    spyOn(toDoService.todos$, 'next');
    toDoService.addTodo('newTest');
    const req = httpMock.expectOne(`${fakeEnvironment.baseUrl}/todo-lists`);
    const response = { data: {item: newToDo} };
    req.flush(response);
    tick();
    expect(toDoService.todos$.next).toHaveBeenCalledWith(newStateTodos);
  }));

  it('deleteTodo() should delete request', fakeAsync(() => {
    toDoService.deleteTodo('1');
    const req = httpMock.expectOne(`${fakeEnvironment.baseUrl}/todo-lists/${'1'}`);
    tick();
    expect(req.request.method).toBe('DELETE');
  }));

  it('deleteTodo() should return new ToDo State', fakeAsync(() => {
    const initialStateTodos: DomainTodo[] = [
      {id: '2', title: 'newTest', addedDate: '18.07.2023',order: 6, filter: 'all' },
      {id: '1', title: 'test', addedDate: '01.01.2023',order: 5, filter: 'all' },
    ];
    const newStateTodos: DomainTodo[] = [
      {id: '2', title: 'newTest', addedDate: '18.07.2023',order: 6, filter: 'all' },
    ];
    toDoService.todos$.next(initialStateTodos);
    spyOn(toDoService.todos$, 'next');
    toDoService.deleteTodo('1');
    const req = httpMock.expectOne(`${fakeEnvironment.baseUrl}/todo-lists/${'1'}`);
    const response = {};
    req.flush(response);
    tick();
    expect(toDoService.todos$.next).toHaveBeenCalledWith(newStateTodos);
  }));

  it('updateTodoTitle() should put request', fakeAsync(() => {
    toDoService.updateTodoTitle('1', 'New title');
    const req = httpMock.expectOne(`${fakeEnvironment.baseUrl}/todo-lists/${'1'}`);
    tick();
    expect(req.request.method).toBe('PUT');
  }));

  it('updateTodoTitle() should return ToDo list with new titles', fakeAsync(() => {
    const initialStateTodos: DomainTodo[] = [
      {id: '1', title: 'test', addedDate: '01.01.2023',order: 5, filter: 'all' },
      {id: '2', title: 'newTest', addedDate: '18.07.2023',order: 6, filter: 'all' },
    ];
    const newStateTodos: DomainTodo[] = [
      {id: '1', title: 'New title', addedDate: '01.01.2023',order: 5, filter: 'all' },
      {id: '2', title: 'newTest', addedDate: '18.07.2023',order: 6, filter: 'all' },
    ];
    toDoService.todos$.next(initialStateTodos);
    spyOn(toDoService.todos$, 'next');
    toDoService.updateTodoTitle('1', 'New title');
    const req = httpMock.expectOne(`${fakeEnvironment.baseUrl}/todo-lists/${'1'}`);
    const response = {};
    req.flush(response);
    tick();
    expect(toDoService.todos$.next).toHaveBeenCalledWith(newStateTodos);
  }));

  it('changeFilter() should return new ToDo list', fakeAsync(() => {
    const toDoId = '1';
    const filter = 'completed';
    const initialStateTodos: DomainTodo[] = [
      {id: '1', title: 'test', addedDate: '01.01.2023',order: 5, filter: 'all' },
      {id: '2', title: 'newTest', addedDate: '18.07.2023',order: 6, filter: 'all' },
    ];
    const newStateTodos: DomainTodo[] = [
      {id: '1', title: 'test', addedDate: '01.01.2023',order: 5, filter: 'completed' },
      {id: '2', title: 'newTest', addedDate: '18.07.2023',order: 6, filter: 'all' },
    ];
    toDoService.todos$.next(initialStateTodos);
    toDoService.changeFilter(toDoId, filter);
    const updatedTodos = toDoService.todos$.getValue();
    tick();
    expect(updatedTodos).toEqual(newStateTodos);
  }));

});
