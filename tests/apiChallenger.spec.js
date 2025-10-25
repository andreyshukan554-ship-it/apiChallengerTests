import { test, expect } from '@playwright/test';
import {Api} from '../src/services/api.service';
import {ToDoBuilder} from '../src/helpers/builders/index'

let token;
let createdToDoId;

test.describe('Challenge', () => {
    test.beforeAll('Get token @authorization', async ({request}, testInfo) => {

        const api = new Api(request);

        const r = await api.challenger.post(testInfo);

        const headers = r.headers();

        console.log(headers["location"]);

        token = headers["x-challenger"];

        expect(r.status()).toBe(201);
    });

    test('Get challenges', {tag: '@APISPEC'}, async ({request}, testInfo) => {

        const api = new Api(request);

        let r = await api.challenges.get(testInfo, token);

        let body = await r.json();

        expect(r.status()).toBe(200);

        expect(body.challenges.length).toBe(59);

    });

    test('Get all todos', {tag: '@APISPEC'}, async ({request}, testInfo) => {

        const api = new Api(request);

        let r = await api.todos.get(testInfo, token);

        let body = await r.json();

        expect(r.status()).toBe(200);

        expect(Array.isArray(body.todos)).toBe(true);

    });

    test('Get todos by wrong url', {tag: '@APISPEC'}, async ({request}, testInfo) => {

        const api = new Api(request);

        let r = await api.todos.getByWrongURL(testInfo, token);

        expect(r.status()).toBe(404);


    });

    test('Get todo by ID', {tag: '@APISPEC'}, async ({request}, testInfo) => {

        const api = new Api(request);

        let ar = await api.todos.getById(testInfo, token, 0);

        let body = await ar[0].json();

        let titleForCheck = ar[1];


        expect(ar[0].status()).toBe(200);

        expect(body.todos[0].title).toBe(titleForCheck);

    });

    test('Get todo by wrong ID', {tag: '@APISPEC'}, async ({request}, testInfo) => {

        const api = new Api(request);

        let r = await api.todos.getByWrongId(testInfo, token);

        expect(r.status()).toBe(404);

    });

    test('Get done todos', {tag: '@APISPEC'}, async ({request}, testInfo) => {

        const api = new Api(request);

        let r = await api.todos.getDoneTodos(testInfo, token);

        let body = await r.json();


        expect(r.status()).toBe(200);


    });

    test('Head todos', {tag: '@APISPEC'}, async ({request}, testInfo) => {

        const api = new Api(request);

        let r = await api.todos.getDoneTodos(testInfo, token);

        let headers = r.headers();

        expect(r.status()).toBe(200);
    });

    test('Create ToDo', {tag: '@APISPEC'}, async ({request}, testInfo) => {

        const api = new Api(request);

        const todo = new ToDoBuilder()
            .addDescription(20)
            .addTitle(30)
            .addDoneStatus()
            .generate();

        let r = await api.todos.CreateToDo(testInfo, token, todo);

        let body = await r.json();

        createdToDoId = body.id;

        expect(r.status()).toBe(201);
        expect(body.title).toEqual(todo.title);
        expect(body.description).toEqual(todo.description);
        expect(body.doneStatus).toEqual(todo.doneStatus);

    });

    test('Create ToDo wrong doneStatus value', {tag: '@APISPEC'}, async ({request}, testInfo) => {

        const api = new Api(request);

        const todo = new ToDoBuilder()
            .addDescription(20)
            .addTitle(30)
            .addDoneStatus('test')
            .generate();

        let r = await api.todos.CreateToDo(testInfo, token, todo);

        let body = await r.json();



        expect(r.status()).toBe(400);
        expect(body.errorMessages[0]).toBe('Failed Validation: doneStatus should be BOOLEAN but was STRING');

    });

    test('Create ToDo with a too long title', {tag: '@APISPEC'}, async ({request}, testInfo) => {

        const api = new Api(request);

        const todo = new ToDoBuilder()
            .addDescription(20)
            .addTitle(51)
            .addDoneStatus()
            .generate();

        let r = await api.todos.CreateToDo(testInfo, token, todo);

        let body = await r.json();


        expect(r.status()).toBe(400);
        expect(body.errorMessages[0]).toBe('Failed Validation: Maximum allowable length exceeded for title - maximum allowed is 50');

    });

    test('Create ToDo with a too long description', {tag: '@APISPEC'}, async ({request}, testInfo) => {

        const api = new Api(request);

        const todo = new ToDoBuilder()
            .addDescription(201)
            .addTitle(20)
            .addDoneStatus()
            .generate();

        let r = await api.todos.CreateToDo(testInfo, token, todo);

        let body = await r.json();


        expect(r.status()).toBe(400);
        expect(body.errorMessages[0]).toBe('Failed Validation: Maximum allowable length exceeded for description - maximum allowed is 200');

    });

    test('Create ToDo with max out content', {tag: '@APISPEC'}, async ({request}, testInfo) => {

        const api = new Api(request);

        const todo = new ToDoBuilder()
            .addDescription(200)
            .addTitle(50)
            .addDoneStatus()
            .generate();

        let r = await api.todos.CreateToDo(testInfo, token, todo);

        let body = await r.json();

        expect(r.status()).toBe(201);
        expect(body.title).toEqual(todo.title);
        expect(body.description).toEqual(todo.description);
        expect(body.doneStatus).toEqual(todo.doneStatus);

    });

    test('Create ToDo with a too long content', {tag: '@APISPEC'}, async ({request}, testInfo) => {

        const api = new Api(request);

        const todo = new ToDoBuilder()
            .addDescription(5000)
            .addTitle(20)
            .addDoneStatus()
            .generate();

        let r = await api.todos.CreateToDo(testInfo, token, todo);

        let body = await r.json();


        expect(r.status()).toBe(413);
        expect(body.errorMessages[0]).toBe('Error: Request body too large, max allowed is 5000 bytes');

    });

    test('Create ToDo with extra field', {tag: '@APISPEC'}, async ({request}, testInfo) => {

        const api = new Api(request);

        const todo = new ToDoBuilder()
            .addDescription(20)
            .addTitle(30)
            .addDoneStatus()
            .addPriority(5)
            .generate();

        let r = await api.todos.CreateToDoExtraField(testInfo, token, todo);

        let body = await r.json();

        expect(r.status()).toBe(400);
        expect(body.errorMessages[0]).toBe('Could not find field: priority');

    });

    test('Create ToDo with PUT', {tag: '@APISPEC'}, async ({request}, testInfo) => {

        const api = new Api(request);

        const todo = new ToDoBuilder()
            .addDescription(20)
            .addTitle(30)
            .addDoneStatus()
            .generate();

        let toDoId = createdToDoId + 1;

        let r = await api.todos.CreateToDoWithPut(testInfo, token, todo, toDoId);


        expect(r.status()).toBe(400);

    });

    test('Update todo with POST', {tag: '@APISPEC'}, async ({request}, testInfo) => {

        const api = new Api(request);

        const todo = new ToDoBuilder()
            .addDescription(20)
            .addTitle(30)
            .addDoneStatus()
            .generate();

        let rCreated = await api.todos.CreateToDo(testInfo, token, todo);

        let bodyCreated = await rCreated.json();

        createdToDoId = bodyCreated.id;

        const todoEdit = new ToDoBuilder()
            .addDescription(20)
            .addTitle(30)
            .addDoneStatus()
            .generate();


        let r = await api.todos.UpdateToDoWithPost(testInfo, token, todoEdit, createdToDoId);

        let body = await r.json();

        expect(r.status()).toBe(200);
        expect(body.title).toEqual(todoEdit.title);
        expect(body.description).toEqual(todoEdit.description);
        expect(body.doneStatus).toEqual(todoEdit.doneStatus);

    });

    test('Update todo with POST not existed TODO', {tag: '@APISPEC'}, async ({request}, testInfo) => {

        const api = new Api(request);

        let notExistedToDo = createdToDoId + 1;

        const todoEdit = new ToDoBuilder()
            .addDescription(20)
            .addTitle(30)
            .addDoneStatus()
            .generate();


        let r = await api.todos.UpdateToDoWithPost(testInfo, token, todoEdit, notExistedToDo);

        expect(r.status()).toBe(404);

    });

    test('Update ToDo with PUT all fields', {tag: '@APISPEC'}, async ({request}, testInfo) => {

        const api = new Api(request);

        const todo = new ToDoBuilder()
            .addDescription(20)
            .addTitle(30)
            .addDoneStatus()
            .generate();

        let rCreated = await api.todos.CreateToDo(testInfo, token, todo);

        let bodyCreated = await rCreated.json();

        createdToDoId = bodyCreated.id;

        const todoEditPut = new ToDoBuilder()
            .addTitle(30)
            .addDescription(20)
            .addDoneStatus()
            .generate();


        let r = await api.todos.CreateToDoWithPut(testInfo, token, todoEditPut, createdToDoId);

        let body = await r.json();

        expect(r.status()).toBe(200);
        expect(body.title).toEqual(todoEditPut.title);
        expect(body.description).toEqual(todoEditPut.description);
        expect(body.doneStatus).toEqual(todoEditPut.doneStatus);

    });

    test('Update ToDo with PUT required fields', {tag: '@APISPEC'}, async ({request}, testInfo) => {

        const api = new Api(request);

        const todo = new ToDoBuilder()
            .addDescription(20)
            .addTitle(30)
            .addDoneStatus()
            .generate();

        let rCreated = await api.todos.CreateToDo(testInfo, token, todo);

        let bodyCreated = await rCreated.json();

        createdToDoId = bodyCreated.id;

        const todoEditPut = new ToDoBuilder()
            .addTitle(30)
            .generate();


        let r = await api.todos.CreateToDoWithPut(testInfo, token, todoEditPut, createdToDoId);


        let body = await r.json();

        expect(r.status()).toBe(200);
        expect(body.title).toEqual(todoEditPut.title);

    });

    test('Update ToDo with PUT no Title', {tag: '@APISPEC'}, async ({request}, testInfo) => {

        const api = new Api(request);

        const todo = new ToDoBuilder()
            .addDescription(20)
            .addTitle(30)
            .addDoneStatus()
            .generate();

        let rCreated = await api.todos.CreateToDo(testInfo, token, todo);

        let bodyCreated = await rCreated.json();

        createdToDoId = bodyCreated.id;

        const todoEditPut = new ToDoBuilder()
            .addDescription(20)
            .generate();


        let r = await api.todos.CreateToDoWithPut(testInfo, token, todoEditPut, createdToDoId);


        expect(r.status()).toBe(400);

    });

    test('Update ToDo with PUT with id in payload', {tag: '@APISPEC'}, async ({request}, testInfo) => {

        const api = new Api(request);

        const todo = new ToDoBuilder()
            .addDescription(20)
            .addTitle(30)
            .addDoneStatus()
            .generate();

        let rCreated = await api.todos.CreateToDo(testInfo, token, todo);

        let bodyCreated = await rCreated.json();

        createdToDoId = bodyCreated.id;
         let payloadId = bodyCreated.id + 1;

        const todoEditPut = new ToDoBuilder()
            .addDescription(20)
            .addTitle(30)
            .addDoneStatus()
            .addId(payloadId)
            .generate();


        let r = await api.todos.CreateToDoWithPut(testInfo, token, todoEditPut, createdToDoId);

        let body = await r.json();

        console.log(body)

        expect(r.status()).toBe(400);

    });

    test('Delete ToDo by id', {tag: '@APISPEC'}, async ({request}, testInfo) => {

        const api = new Api(request);

        const todo = new ToDoBuilder()
            .addDescription(20)
            .addTitle(30)
            .addDoneStatus()
            .generate();

        let rCreated = await api.todos.CreateToDo(testInfo, token, todo);

        let bodyCreated = await rCreated.json();

        createdToDoId = bodyCreated.id;

        let r = await api.todos.DeleteId(testInfo, token, createdToDoId);

        expect(r.status()).toBe(200);

        let searchDeletedR = await api.todos.SearchCreatedToDo(testInfo, token, createdToDoId);

        expect(searchDeletedR.status()).toBe(404);

    });

});