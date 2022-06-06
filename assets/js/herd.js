import {Sheep} from './sheep.js';

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

        this.PREFFERED_DIST_FROM_HERD_CENTER = 100;

        for (let i = 0; i < this.numSheep; i++) {
            let randX = Math.random() * canvasWidth;
            let randY = Math.random() * canvasHeight;
            let newSheep = new Sheep(randX, randY);
            this.xArray.push(newSheep);
            this.yArray.push(newSheep);
        }
        this.sortArrays();
        this.calculateHerdCenter();
    }

    /**
     * Called by the GameRunner on each frame, to re-sort the position-based
     * arrays, create an array for each sheep of its nearest neighbours, and
     * update each sheep in turn.
     * 
     * @param {Dog} dog 
     */
    update(dog) {
        this.calculateHerdCenter();
        this.sortArrays();

        let preferredDistFromHerdCenter = dog.barking ? 
            this.PREFFERED_DIST_FROM_HERD_CENTER : 
            this.PREFFERED_DIST_FROM_HERD_CENTER / 4;

        for (let sheep of this.xArray) {

            // Get nearest neighbour set for each sheep.
            let nearestNeighbours = new Set();
            let ownIndex = this.xArray.indexOf(this);
            if (ownIndex < this.xArray.length - 1) {
                let pointer = ownIndex + 1;
                while (this.#evaluateDistance(this.xArray[pointer], sheep)) {
                    nearestNeighbours.add(this.xArray[pointer]);
                    pointer++;
                    if (pointer = this.xArray.length) {
                        break;
                    }
                }
            }
            if (ownIndex > 0) {
                let pointer = ownIndex - 1;
                while (this.#evaluateDistance(this.xArray[pointer], sheep)) {
                    nearestNeighbours.add(this.xArray[pointer]);
                    pointer--;
                    if (pointer = 0) {
                        break;
                    }
                }
            }

            // Calculate the center of this array.
            let center = this.calculateHerdCenter(nearestNeighbours);

            sheep.update(center, dog);
        }
    }

    calculateHerdCenter(array) {
        let totalX;
        let totalY;
        for (let i = 0; i < this.xArray.length; i++) {
            totalX += this.xArray[i].xPos;
            totalY += this.xArray[i].yPos;
        }
        this.centerX = totalX / this.numSheep;
        this.centerY = totalY / this.numSheep;
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
    #evaluateDistance(sheep1, sheep2) {
        let xDist = sheep1.xPos - sheep2.xPos;
        let yDist = sheep1.yPos - sheep2.yPos;
        let distanceSquared = Math.pow(xDist, 2) + Math.pow(yDist, 2);
        let preferredDistSq = Math.pow(this.preferredDistFromHerdCenter, 2);
        return (distanceSquared <= preferredDistSq);
    }
}

export {Herd};