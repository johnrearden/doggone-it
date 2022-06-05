import {
    getAngularDifference
} from "./utilities.js";

class Sheep {

    constructor(xPos, yPos) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.direction = 0;
        this.velocity = 0;
        this.anxiety = 1;

        this.MAX_VELOCITY = 1.5;
        this.ANGULAR_CHANGE_PER_FRAME = Math.PI / 24;
    }

    update(centerOfNearNeighbours, dog) {

    }



}

export {Sheep};