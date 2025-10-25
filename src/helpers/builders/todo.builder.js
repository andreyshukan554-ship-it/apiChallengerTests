import { faker } from '@faker-js/faker';

export class ToDoBuilder {
    addTitle (symbol) {
        this.title = faker.string.alpha({length: symbol})
        return this;
    }
    addDoneStatus (status = true) {
        this.doneStatus = status
        return this;
    }
    addDescription (symbols) {
        this.description = faker.string.alpha({length: symbols})
        return this;
    }

    addPriority (symbols) {
        this.priority = faker.string.alpha({length: symbols})
        return this;
    }

    addId (id) {
        this.priority = faker.string.alpha({length: id})
        return this;
    }

    generate () {
        return {...this };
    }

}