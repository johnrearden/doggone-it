const Dog = require("../dog");

describe("Dog", () => {
    test("constructor should return an object with correct initial position", () => {
        dog = new Dog(10, 10);
        expect(dog.xPos).toBe(10);
    });
})