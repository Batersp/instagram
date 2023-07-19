import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TodosComponent } from './todos.component'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { Router } from '@angular/router'
import { AuthService } from '../../../core/services/auth.service'
import { TodosService } from '../../services/todos.service'
import { DomainTodo } from '../../models/todos.models'
import { of } from 'rxjs'

describe('TodosComponent ', () =>{
  let component: TodosComponent;
  let fixture: ComponentFixture<TodosComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  const fakeTodosService = jasmine.createSpyObj('todosService', ['getTodos', 'addTodo', 'deleteTodo', 'updateTodoTitle', 'changeFilter']);
  const fakeAuthService = jasmine.createSpyObj('authService', ['login', 'logout', 'me']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [ TodosComponent ],
      providers: [
        { provide: TodosService, useValue: fakeTodosService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
      .compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodosComponent);
    component = fixture.componentInstance;
    component.todoTitle = 'test';
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should add a new todo when addTodoHandler is called', () => {
    const todoTitle = 'New Todo';
    component.todoTitle = todoTitle;
    component.addTodoHandler();
    expect(fakeTodosService.addTodo).toHaveBeenCalledWith(todoTitle);
    expect(component.todoTitle).toBe('');
  });

  it('should delete a todo when deleteTodo is called', () => {
    const todoId = '1';
    component.deleteTodo(todoId);
    expect(fakeTodosService.deleteTodo).toHaveBeenCalledWith(todoId);
  });

  it('should update the title of a todo when editTodo is called', () => {
    const todoId = '1';
    const title = 'Updated Title';
    component.editTodo({
      todoId: todoId,
      title: title
    });
    expect(fakeTodosService.updateTodoTitle).toHaveBeenCalledWith(todoId, title);
  });

  it('should call authService.logout when logoutHandler is called', () => {
    component.logoutHandler();

    expect(fakeAuthService.logout).toHaveBeenCalled();
  });
});
