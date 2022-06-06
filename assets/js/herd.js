import {Sheep} from './sheep.js';

class Herd {
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

    update(dog) {
        this.calculateHerdCenter();
        this.sortArrays();

        let preferredDistFromHerdCenter = dog.barking ? 
            this.PREFFERED_DIST_FROM_HERD_CENTER : 
            this.PREFFERED_DIST_FROM_HERD_CENTER / 4;

        for (let sheep of this.xArray) {

            // Get nearest neighbour array for each sheep.
            let nearestNeighbours = [];

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

    sortArrays() {
        this.xArray.sort((sheep1, sheep2) => {
            return sheep1.xPos - sheep2.xPos;
        });
        this.yArray.sort((sheep1, sheep2) => {
            return sheep1.yPos - sheep2.yPos;
        });
    }
}

export {Herd};