import { Herd } from '../herd.js';
import { levels } from '../../data/levels.js';
describe("Test the herd class", () => {
    describe("Test the Herd() constructor", () => {
        let herd;
        let testNumber;
        beforeEach(() => {
            testNumber = levels[0].sheep;
            herd = new Herd(levels[0]);
        });
        it("should not return undefined", () => {
            expect(herd).toBeDefined();
        });
        it("should contain the correct number of sheep in xArray and yArray", () => {
            expect(herd.xArray.length).toBe(testNumber);
            expect(herd.yArray.length).toBe(testNumber);
        });
    });
    describe("Test the removeDepartedSheep function", () => {
        let herd;
        beforeEach(() => {
            herd = new Herd(levels[0]);
        });
        it("should leave length of xArray and yArray unchanged if all sheep are inside game area", () => {
            let xStartingLength = herd.xArray.length;
            let yStartingLength = herd.yArray.length;
            herd.removeDepartedSheep();
            expect(herd.xArray.length).toBe(xStartingLength);
            expect(herd.yArray.length).toBe(yStartingLength);
        });
        it("should reduce length of xArray by 1 if one sheep is outside the game-area", () => {
            let startingLength = herd.xArray.length;
            herd.xArray[0].yPos = -10;
            herd.removeDepartedSheep();
            expect(herd.xArray.length).toBe(startingLength - 1);
        });
        it("should reduce length of yArray by 1 if one sheep is outside the game-area", () => {
            let startingLength = herd.yArray.length;
            herd.yArray[0].yPos = -10;
            herd.removeDepartedSheep();
            expect(herd.yArray.length).toBe(startingLength - 1);
        });
    });
    describe("Test the calculateAverageXPosition function", () => {
        let herd;
        beforeEach(() => {
            herd = new Herd(levels[0]);
            herd.xArray.length = 3;
        });
        it("should return 2 for average xPosition of [1, 2, 3]", () => {
            herd.xArray[0].xPos = 1;
            herd.xArray[1].xPos = 2;
            herd.xArray[2].xPos = 3;
            expect(herd.calculateAverageXPosition()).toBe(2);
        });
    });
    describe("Test the calculateAverageYPosition function", () => {
        let herd;
        beforeEach(() => {
            herd = new Herd(levels[0]);
            herd.yArray.length = 3;
        });
        it("should return 2 for average yPosition of [1, 2, 3]", () => {
            herd.yArray[0].yPos = 1;
            herd.yArray[1].yPos = 2;
            herd.yArray[2].yPos = 3;
            expect(herd.calculateAverageYPosition()).toBe(2);
        });
    });
    describe("Test the sortPositionArrays function", () => {
        let herd;
        beforeEach(() => {
            herd = new Herd(levels[0]);
        });
        it("should sort the xArray by increasing value of x", () => {
            herd.sortPositionArrays();
            for (let i = 1; i < herd.xArray.length; i++) {
                expect(herd.xArray[i].xPos).toBeGreaterThanOrEqual(herd.xArray[i - 1].xPos);
            }
        });
        it("should sort the yArray by increasing value of y", () => {
            herd.sortPositionArrays();
            for (let i = 1; i < herd.yArray.length; i++) {
                expect(herd.yArray[i].yPos).toBeGreaterThanOrEqual(herd.yArray[i - 1].yPos);
            }
        });
    });
});
