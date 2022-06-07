import {getAngularDifference} from "./utilities.js";
import {SHEEP_MAX_DIST_FROM_NEIGHBOURS,
        SHEEP_ANGULAR_CHANGE_PER_FRAME,
        SHEEP_BASE_VELOCITY_TOWARDS_NEIGHBOURS,
        SHEEP_BASE_VELOCITY_AWAY_FROM_DOG} from './constants.js';

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
        this.moving = false;
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
     * @param {set} centerOfNearNeighbours
     * @param {Dog} dog 
     */
    update(centerOfNearNeighbours, dog) {

        // Calculate the center of the nearest neighbours set
        let xCenter, yCenter;
        let totalX = 0;
        let totalY = 0;
        centerOfNearNeighbours.forEach(member => {
            totalX += member.xPos;
            totalY += member.yPos;
        })
        xCenter = totalX / centerOfNearNeighbours.size;
        yCenter = totalY / centerOfNearNeighbours.size;

        let xDistSq = Math.pow(xCenter, 2);
        let yDistSq = Math.pow(yCenter, 2);
        let maxDistSq = Math.pow(SHEEP_MAX_DIST_FROM_NEIGHBOURS, 2);
        let xVel = 0, yVel = 0;
        if (maxDistSq > xDistSq + yDistSq) {
            let distance = Math.sqrt(xDistSq + yDistSq);
            let returnArray = this.#moveTowardsNeighbours(distance, xCenter, yCenter);
            xVel += returnArray[0];
            yVel += returnArray[1];
        }
    }

    #moveTowardsNeighbours(distance, xCenter, yCenter) {
        let directionToNeighbours = Math.atan2(
            yCenter - this.yPos,
            xCenter - this.xPos);
        let vel;
        
    }



}

export {Sheep};