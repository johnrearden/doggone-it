import { SHEEP_MAX_VELOCITY_AWAY_FROM_DOG } from '../constants';
import { Dog } from '../dog.js';
import {Sheep} from '../sheep.js';

describe("Test the Sheep class", () => {
    describe("Test the Sheep() constructor", () => {
        let sheep;
        beforeEach(() => {
            sheep = new Sheep(10, 10, 0);
        });
        it("should not return undefined", () => {
            expect(new Sheep(10, 10, 0)).toBeDefined();
        });
    });

    describe("Test the getVelocityAwayFromDog function", () => {
        let sheep, dog;
        beforeEach(() => {
            sheep = new Sheep(100, 100, 0);
        });
        it("Should return x and y velocities in the opposite direction to the dog", () => {
            dog = new Dog(150, 50, []);
            let [xVel, yVel] = sheep.getVelocityAwayFromDog(dog);
            let direction = Math.atan2(yVel, xVel);
            expect(direction).toBeCloseTo(Math.PI * 0.75);
        });
        it(`Should return velocity components which combine to be less than the
        SHEEP_MAX_VELOCITY_AWAY_FROM_DOG`, () => {
            dog = new Dog(101, 101, []);
            let [xVel, yVel] = sheep.getVelocityAwayFromDog(dog);
            let velocity = Math.sqrt(xVel * xVel + yVel * yVel);
            expect(velocity).toBeLessThanOrEqual(SHEEP_MAX_VELOCITY_AWAY_FROM_DOG);
        });
    });

});