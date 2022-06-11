const Dog = require("../dog");

describe("Testing the Dog class and its methods", () => {

    let dog;
    beforeEach(() => {
        dog = new Dog(100, 100);
    });

    describe("Dog()", () => {
        test("Constructor should return a valid object", () => {
            expect(dog).toBeDefined();
        });
        test("constructor should return an object with correct initial position", () => {
            expect(dog.xPos).toBe(100) && expect(dog.yPos.toBe(100));
        });
    })

    describe("onPointerDown()", () => {
        test("method should set pointerDown flag to true if parameter is false", () => {
            dog.onPointerDown(10, 10);
            expect(dog.pointerDown).toBe(true);
        });
        test("method should clear the dog object's destinations array if pointerDown is false", () => {
            dog.pointerDown = false;
            dog.onPointerDown(10, 10);
            expect(dog.wayPoints.length).toBe(0);
        });
        test("method should not clear the destination array if pointerDown is already true", () => {
            dog.pointerDown = true;
            dog.onPointerDown(10, 10);
            dog.wayPoints = [[50, 50], [60, 60]];
            expect(dog.wayPoints.length).toBeGreaterThan(0);
        });
        test("Method should add a point to the destination array if pointerDown is true", () => {
            dog.pointerDown = true;
            dog.onPointerMove(1, 1);
        });
        test("Method should set pointerDown flag to false", () => {
            dog.pointerDown = true;
            dog.onPointerUp(1, 1);
            expect(dog.pointerDown).toBe(false);
        });
        test("Method should add parameters passed to the destination array", () => {
            dog.onPointerUp(1, 1);
            expect(dog.wayPoints[dog.wayPoints.length - 1]).toStrictEqual([1, 1]);
        });
    });
});