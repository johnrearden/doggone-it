import {Dog} from '../dog.js';
import { getAngularDifference } from '../utilities.js';

describe("Testing the Dog class and its methods", () => {

    let dog;
    beforeEach(() => {
        dog = new Dog(100, 100, []);
    }); 

    describe("Test the Dog() constructor", () => {
        test("Constructor should return a valid object", () => {
            expect(dog).toBeDefined();
        });
        test("constructor should return an object with correct initial position", () => {
            expect(dog.xPos).toBe(100) && expect(dog.yPos).toBe(100);
        });
    });

    describe("test the onPointerDown() function", () => {
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
    });

    describe("test the onPointerMove function", () => {
        test("Method should add a point to the destination array if pointerDown is true", () => {
            dog.pointerDown = true;
            dog.onPointerMove(1, 1);
        });
    });

    describe("test the onPointerUp function", () => {
        test("Method should set pointerDown flag to false", () => {
            dog.pointerDown = true;
            dog.onPointerUp(100, 100);
            expect(dog.pointerDown).toBe(false);
        });
        test("Method should add parameters passed to the destination array", () => {
            dog.onPointerUp(100, 100);
            expect(dog.wayPoints[dog.wayPoints.length - 1]).toStrictEqual([100, 100]);
        });
    });

    describe("test the turnTowardsDestination function", () => {
        test("After calling the method, the dog's direction should be closer to the direction to his destination", () => {
            dog.xPos = 0;
            dog.yPos = 0;
            dog.xDest = 5;
            dog.yDest = 0;
            dog.direction = -Math.PI / 2;
            dog.turnTowardsDestination();
            expect(dog.direction).toBeGreaterThan(-Math.PI / 2);
            dog.direction = Math.PI / 2;
            dog.turnTowardsDestination();
            expect(dog.direction).toBeLessThan(Math.PI / 2);            
        });
    });
});