import {Sheep } from './sheep.js';
import {FIELD_WIDTH,
        FIELD_BORDER,
        FIELD_HEIGHT} from './constants.js';   
import { Point, Rectangle, rectContainsPoint } from './utilities.js';

var count = 0;

export class Herd {
    /**
     * Represents a collection of sheep. It stores its members in two arrays, 
     * a horizontal and a vertical array. These are maintained in sorted order
     * by x-position and y-position respectively, in order to facilitate quick
     * lookup of each sheep's nearest neighbours.
     * 
     * Testing each sheep's distance from each of its neighbours would be 
     * an algorithm with quadratic complexity. Even though the number of sheep is
     * not large, this is better avoided to allow the class to be reused in an
     * application which needs more members.
     * 
     * @param {Integer} numSheep 
     * @param {Number} canvasWidth 
     * @param {Number} canvasHeight 
     */
    constructor(level) {
        this.numSheep = level.sheep;
        this.centerX = 0;
        this.centerY = 0;
        this.xArray = [];
        this.yArray = [];
        this.allSheepGone = false;
        this.id = count++;
        this.obstacles = level.obstacles;

        for (let i = 0; i < this.numSheep; i++) {
            let possibleSpawnPoints = this.getPossibleSpawnPoints(this.numSheep);
            let isLamb = i % 2 === 0 ? true : false;
            let newSheep = new Sheep(
                possibleSpawnPoints[i][0], 
                possibleSpawnPoints[i][1], 
                i,
                isLamb);
            this.xArray.push(newSheep);
            this.yArray.push(newSheep);
        }
    }

    /**
     * Called by the GameRunner on each frame, to update each sheep in turn.
     * 
     * @param {Dog} dog 
     */
    update(dog) {
        this.removeDepartedSheep();

        this.sortPositionArrays();

        this.centerX = this.calculateAverageXPosition();
        this.centerY = this.calculateAverageYPosition();

        for (let sheep of this.xArray) {
            // Update the sheep, passing a reference to the dog.
            sheep.update(this.centerX, this.centerY, dog, this.obstacles);
        }
    }

    /**
     * Checks if any sheep in the herd have left the game area via the top of the screen
     * (where yPos < 0) and if so, removes them.
     */
    removeDepartedSheep() { 
        // If sheep has left the field, remove it from the game.
        this.xArray = this.xArray.filter(sheep => sheep.yPos > 0);
        this.yArray = this.yArray.filter(sheep => sheep.yPos > 0);
        if (this.xArray.length === 0) {
            this.allSheepGone = true;
        }
        document.getElementById("sheep-remaining").innerText = this.xArray.length;
    }

    /**
     * Calculates the average position on the x-axis of the sheep in xArray
     * @returns average x position
     */
    calculateAverageXPosition() {
        let total = 0;
        for(let i = 0; i < this.xArray.length; i++) {
            total += this.xArray[i].xPos;
        }
        return total / this.xArray.length;
    }

    /**
     * Calculates the average position on the y-axis of the sheep in yArray
     * @returns average y position
     */
    calculateAverageYPosition() {
        let total = 0;
        for(let i = 0; i < this.yArray.length; i++) {
            total += this.yArray[i].yPos;
        }
        return total / this.yArray.length;
    }

    /**
     * Sorts the xArray in order of increasing x position of its sheep, and
     * the yArray in order of increasing y position of its sheep
     */
    sortPositionArrays() {
        this.xArray.sort((sheep1, sheep2) => {
            return sheep1.xPos - sheep2.xPos;
        });
        this.yArray.sort((sheep1, sheep2) => {
            return sheep1.yPos - sheep2.yPos;
        });
    }

    /**
     * Creates a collection of spawn points for the herd that do not overlap with
     * any of the obstacles in this level
     * 
     * @param {Integer} numSheep 
     * @returns an array containing legal spawn points for the sheep
     */
    getPossibleSpawnPoints(numSheep) {
        let array = [];
        for (let i = 0; i < numSheep; i++) {
            let randX, randY; 
            do {
                randX = FIELD_BORDER + Math.random() * (FIELD_WIDTH - 2 * FIELD_BORDER);
                randY = FIELD_BORDER + Math.random() * (FIELD_HEIGHT - 2 * FIELD_BORDER);
            } while (!this.pointIsValid(randX, randY));
            array.push([randX, randY]);
        }
        return array;
    }

    /**
     * Checks if the supplied point overlaps with any of the obstacles in 
     * this level
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @returns true if the point supplied does not overlap with any obstacles,
     * false otherwise
     */
    pointIsValid(x, y) {
        for (let ob of this.obstacles) {
            let rect = new Rectangle(ob.x, 
                                     ob.y, 
                                     ob.x + ob.width, 
                                     ob.y + ob.height);
            if (rectContainsPoint(rect, new Point(x, y))) {
                return false;
            }
        }
        return true;
    }
}
