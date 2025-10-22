import { test } from '@playwright/test';

export class ChallengesService {
    constructor(request) {
        this.request = request;
    }

    async get(testInfo, token) {
        return test.step('Get /challenges', async () => {
            const response = await this.request.get(`${testInfo.project.use.apiURL}/challenges`,
                {headers: {"x-challenger": token}});
//            const body = await response.json();
//            return body;
            return response;

        });
    }
}