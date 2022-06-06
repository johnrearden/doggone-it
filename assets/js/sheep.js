import {
    getAngularDifference
} from "./utilities.js";

class Sheep {
    /**
     * Represents a sheep, with a velocity and direction. The sheep also
     * has an anxiety field, which affects how the sheep reacts to the
     * dog and the other members of its herd.
     * 
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

    /**
     * Takes in the center of the nearest (and thus relevant) 
     * neighbouring sheep and the dog object. This sheep will tend to move
     * towards its nearest neighbours (its a herd animal!). 
     * 
     * It will move away from the dog if the distance between them is below 
     * a threshold (the threshold is lower if the dog is barking).
     * 
     * Its velocity will increase in direct proportion to its anxiety score, 
     * which depends upon its distance from the dog, and whether the dog
     * is barking.
     * 
     * @param {Number} centerOfNearNeighbours 
     * @param {Number} dog 
     */
    update(centerOfNearNeighbours, dog) {

    }



}

export {Sheep};