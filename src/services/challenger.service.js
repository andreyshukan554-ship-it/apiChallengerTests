import { test } from '@playwright/test';

export class ChallengerService{
    constructor(request) {
        this.request = request;
    }
    async post(testInfo) {
        return test.step('Post /challenger', async () => {
            const response = await this.request.post(`${testInfo.project.use.apiURL}/challenger`);
            return response;
        });
    }
}