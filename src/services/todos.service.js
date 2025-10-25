import { test } from '@playwright/test';

export class ToDosService {
    constructor(request) {
        this.request = request;
    }
    async get(testInfo, token) {
        return test.step('Get /todos', async () => {
            const response = await this.request.get(`${testInfo.project.use.apiURL}/todos`,
                {headers: {"x-challenger": token}});
            return response;

        });
    };
    async getByWrongURL(testInfo, token) {
        return test.step('Get /todos by wrong url', async () => {
            const response = await this.request.get(`${testInfo.project.use.apiURL}/todo`,
                {headers: {"x-challenger": token}});
            return response;

        });
    };

    async getById(testInfo, token, toDoIndex) {
        return test.step('Get /todos by id', async () => {
            const responseAllToDos = await this.request.get(`${testInfo.project.use.apiURL}/todos`,
                {headers: {"x-challenger": token}});


            let bodyForId = await responseAllToDos.json();
            let toDoId = bodyForId.todos[toDoIndex].id;
            let toDoTitle = bodyForId.todos[toDoIndex].title;

            const response = await this.request.get(`${testInfo.project.use.apiURL}/todos/${toDoId}`,
                {headers: {"x-challenger": token}});
            return [response, toDoTitle];

        });
    };

    async getByWrongId(testInfo, token) {
        return test.step('Get /todos by wrong id', async () => {
            const responseAllToDos = await this.request.get(`${testInfo.project.use.apiURL}/todos`,
                {headers: {"x-challenger": token}});


            let bodyForId = await responseAllToDos.json();
            let toDoId = bodyForId.todos.length + 2;

            const response = await this.request.get(`${testInfo.project.use.apiURL}/todos/${toDoId}`,
                {headers: {"x-challenger": token}});
            return response;

        });
    };
    async getDoneTodos(testInfo, token) {
        return test.step('Get done todos', async () => {
            const response = await this.request.get(`${testInfo.project.use.apiURL}/todos?doneStatus=true`,
                {headers: {"x-challenger": token}});

            return response;

        });
    };

    async head(testInfo, token) {
        return test.step('Get done todos', async () => {
            const response = await this.request.get(`${testInfo.project.use.apiURL}/todos`,
                {headers: {"x-challenger": token}});

            return response;

        });
    };

    async CreateToDo(testInfo, token, todoPayload) {
        return test.step('Create ToDo', async () => {

            let {title, doneStatus, description} = todoPayload;

            const response = await this.request.post(`${testInfo.project.use.apiURL}/todos`,
                {headers: {"x-challenger": token},
                    data: todoPayload});

            return response;

        });
    };

    async CreateToDoExtraField(testInfo, token, todoPayload) {
        return test.step('Create ToDo', async () => {

            let {title, doneStatus, description, priority} = todoPayload;

            const response = await this.request.post(`${testInfo.project.use.apiURL}/todos`,
                {headers: {"x-challenger": token},
                    data: todoPayload});

            return response;

        });
    };

    async CreateToDoWithPut(testInfo, token, todoPayload, toDoId) {
        return test.step('Create ToDo with Put', async () => {


            let {title, doneStatus, description} = todoPayload;

            const response = await this.request.put(`${testInfo.project.use.apiURL}/todos/${toDoId}`,
                {headers: {"x-challenger": token},
                    data: todoPayload});

            return response;

        });
    };

    async UpdateToDoWithPost(testInfo, token, todoPayload, toDoId) {
        return test.step('Update ToDo with POST', async () => {

            let {title, doneStatus, description} = todoPayload;

            const response = await this.request.post(`${testInfo.project.use.apiURL}/todos/${toDoId}`,
                {headers: {"x-challenger": token},
                    data: todoPayload});

            return response;

        });
    };

    async DeleteId (testInfo, token, toDoId) {
        return test.step('Delete /todos by id', async () => {

            const response = await this.request.delete(`${testInfo.project.use.apiURL}/todos/${toDoId}`,
                {headers: {"x-challenger": token}});
            return response;

        });
    };

    async SearchCreatedToDo (testInfo, token, toDoId) {
        return test.step('Delete /todos by id', async () => {

            const response = await this.request.get(`${testInfo.project.use.apiURL}/todos/${toDoId}`,
                {headers: {"x-challenger": token}});
            return response;

        });
    };

}