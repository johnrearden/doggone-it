import {
    getAngularDifference
} from "./utilities.js";

class Sheep {
    /**
     * Represents a sheep, with a velocity and direction. The sheep also
     * has an anxiety field, which affects how the sheep reacts to the
     * dog and the other members of its herd.
     * @param {Number} xPos 
     * @param {Number} yPos 
     */
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