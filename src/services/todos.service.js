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
    }
}