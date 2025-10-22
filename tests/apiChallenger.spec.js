import { test, expect } from '@playwright/test';
import {Api} from '../src/services/api.service';

let token;

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

        console.log(r);

    });

    test('Get todo by ID', {tag: '@APISPEC'}, async ({request}, testInfo) => {

        const api = new Api(request);

        let ar = await api.todos.getById(testInfo, token, 0);

        let body = await ar[0].json();

        let titleForCheck = ar[1];

        console.log(body);
        console.log(titleForCheck)

        expect(ar[0].status()).toBe(200);

        expect(body.todos[0].title).toBe(titleForCheck);


    });

});