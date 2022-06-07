import {
    Sheep
} from './sheep.js';
import {
    SHEEP_MAX_RANGE_FOR_NEIGHBOURS, SHEEP_NEIGHBOURLY_DISTANCE
} from './constants.js';

class Herd {
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
    constructor(numSheep, canvasWidth, canvasHeight) {
        this.numSheep = numSheep;
        this.centerX = 0;
        this.centerY = 0;
        this.xArray = [];
        this.yArray = [];

        for (let i = 0; i < this.numSheep; i++) {
            let randX = Math.random() * canvasWidth;
            let randY = Math.random() * canvasHeight;
            let newSheep = new Sheep(randX, randY, i);
            this.xArray.push(newSheep);
            this.yArray.push(newSheep);
        }
        this.#sortArrays();
    }

    /**
     * Called by the GameRunner on each frame, to re-sort the position-based
     * arrays, create a set for each sheep of its nearest neighbours, and
     * update each sheep in turn.
     * 
     * @param {Dog} dog 
     */
    update(dog) {
        this.#sortArrays();

        let preferredDist = dog.barking ?
            SHEEP_NEIGHBOURLY_DISTANCE / 4:
            SHEEP_NEIGHBOURLY_DISTANCE;
        
        for (let sheep of this.xArray) {
            // Get nearest neighbour set for each sheep.
            let nearestNeighbours = new Set();

            // Check along the increasing x-axis
            let ownIndex = this.xArray.indexOf(sheep);
            if (ownIndex < this.xArray.length - 1) { // don't run off the array
                let pointer = ownIndex + 1;
                whileLoop:
                while (this.#evaluateDistance(this.xArray[pointer], sheep, preferredDist)) {
                    nearestNeighbours.add(this.xArray[pointer]);
                    pointer++;
                    if (pointer === this.xArray.length) {
                        break whileLoop; // We have reached the end of the array
                    }
                }
            }
            // Check along the decreasing x-axis
            if (ownIndex > 0) {
                let pointer = ownIndex - 1;
                whileLoop:
                while (this.#evaluateDistance(this.xArray[pointer], sheep, preferredDist)) {
                    nearestNeighbours.add(this.xArray[pointer]);
                    pointer--;
                    if (pointer < 0) {
                        break whileLoop;
                    }
                }
            }
            // Check along the increasing y-axis
            ownIndex = this.yArray.indexOf(this);
            if (ownIndex < this.yArray.length - 1) {
                let pointer = ownIndex + 1;
                whileLoop:
                while (this.#evaluateDistance(this.yArray[pointer], sheep, preferredDist)) {
                    nearestNeighbours.add(this.yArray[pointer]);
                    pointer++;
                    if (pointer = this.yArray.length) {
                        break whileLoop;
                    }
                }
                
            }
            // Check along the decreasing y-axis
            if (ownIndex > 0) {
                let pointer = ownIndex - 1;
                whileLoop:
                while (this.#evaluateDistance(this.yArray[pointer], sheep, preferredDist)) {
                    nearestNeighbours.add(this.yArray[pointer]);
                    pointer--;
                    if (pointer < 0) {
                        break whileLoop;
                    }
                }
                
            }

            // Remove the sheep from its own nearest neighbour set.
            nearestNeighbours.delete(sheep);

            // Finally update the sheep, passing the set of nearest neighbours and 
            // a reference to the dog.
            sheep.update(nearestNeighbours, dog);
        }
    }

    #sortArrays() {
        this.xArray.sort((sheep1, sheep2) => {
            return sheep1.xPos - sheep2.xPos;
        });
        this.yArray.sort((sheep1, sheep2) => {
            return sheep1.yPos - sheep2.yPos;
        });
    }

    /**
     * This private method compares the sum of the squares of the distances
     * between 2 sheep on each axis, and the square of the preferred distance
     * from the herd center. It returns true if sheep1 is close enough to sheep2
     * for them to be near neighbours.
     * 
     * The square root of the distances is not calculated as this is a computationally
     * expensive operation, and redundant anyway.
     * 
     * @param {Sheep} sheep1 
     * @param {Sheep} sheep2 
     * @returns true if sheep1 and sheep2 are close enough to be near neighbours
     */
    #evaluateDistance(sheep1, sheep2, preferredDistance) {
        let xDist = sheep1.xPos - sheep2.xPos;
        let yDist = sheep1.yPos - sheep2.yPos;
        let distanceSquared = Math.pow(xDist, 2) + Math.pow(yDist, 2);
        let preferredDistSq = Math.pow(preferredDistance, 2);
        return (distanceSquared <= preferredDistSq);
    }
}

export {
    Herd
};