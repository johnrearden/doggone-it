import {Sheep } from './sheep.js';
import {FIELD_WIDTH,
        FIELD_BORDER,
        FIELD_HEIGHT} from './constants.js';   

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
    constructor(numSheep) {
        this.numSheep = numSheep;
        this.centerX = 0;
        this.centerY = 0;
        this.xArray = [];
        this.yArray = [];

        for (let i = 0; i < this.numSheep; i++) {
            let randX = Math.random() * (FIELD_WIDTH - 2 * FIELD_BORDER);
            let randY = Math.random() * (FIELD_HEIGHT - 2 * FIELD_BORDER);
            let newSheep = new Sheep(randX + FIELD_BORDER, randY + FIELD_BORDER, i);
            this.xArray.push(newSheep);
            this.yArray.push(newSheep);
        }

        let sheepRemainingOutput = document.getElementById("sheep-remaining");
        sheepRemainingOutput.innerText = numSheep;
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
            sheep.update(this.centerX, this.centerY, dog);
        }
    }

    /**
     * Checks if any sheep in the herd have left the game area via the top of the screen
     * (where yPos < 0) and if so, removes them.
     */
    removeDepartedSheep() { 
        // If sheep has left the field, remove it from the game.
        this.xArray = this.xArray.filter(sheep => sheep.yPos > 0);
        this.yArray = this.yArray.filter(sheep => !(sheep.yPos < 0));
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
}
