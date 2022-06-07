import {getAngularDifference, ensureCorrectRange} from "./utilities.js";
import {SHEEP_MAX_RANGE_FOR_NEIGHBOURS,
        SHEEP_ANGULAR_CHANGE_PER_FRAME,
        SHEEP_VELOCITY_TOWARDS_NEIGHBOURS,
        SHEEP_OUTER_REACTION_LIMIT,
        SHEEP_VELOCITY_AWAY_FROM_DOG} from './constants.js';

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
    update(nearestNeighbours, dog) {
        // Calculate the average position of the nearest neighbours set
        let averageNeighbourX, averageNeighbourY;
        let totalX = 0;
        let totalY = 0;
        nearestNeighbours.forEach(member => {
            totalX += member.xPos;
            totalY += member.yPos;
        })
        averageNeighbourX = totalX / nearestNeighbours.size;
        averageNeighbourY = totalY / nearestNeighbours.size;

        // If the sheep is too far away from the average neighbour position, 
        // move it back towards its part of the herd.
        let xVelTowardHerd = 0, yVelTowardHerd = 0;
        let xDistSq = Math.pow(averageNeighbourX, 2);
        let yDistSq = Math.pow(averageNeighbourY, 2);
        let maxDistSq = Math.pow(SHEEP_MAX_RANGE_FOR_NEIGHBOURS, 2);
        if (maxDistSq > xDistSq + yDistSq) {
            [xVelTowardHerd, yVelTowardHerd] = this.#getVelTowardsNeighbours(
                averageNeighbourX, 
                averageNeighbourY);
        }

        // If the sheep is close enough to the dog, it should react by 
        // moving away from it.
        let reactionRange = SHEEP_OUTER_REACTION_LIMIT;
        let xVelAwayFromDog = 0;
        let yVelAwayFromDog = 0;
        if (dog.barking) {
            reactionRange *= 2;
        }
        let dogXDistSq = Math.pow(dog.xPos - this.xPos, 2);
        let dogYDistSq = Math.pow(dog.yPos - this.yPos, 2);
        if (dogXDistSq + dogYDistSq < Math.pow(reactionRange, 2)) {
            let dist = Math.sqrt(dogXDistSq + dogYDistSq);
            let velocity = SHEEP_VELOCITY_AWAY_FROM_DOG;
            let angle = Math.atan2(dog.yPos - this.yPos, dog.xPos - this.xPos);

            // Reverse the angle so that the sheep moves away.
            angle = ensureCorrectRange(angle + Math.PI);
            xVelAwayFromDog = Math.cos(angle) * velocity;
            yVelAwayFromDog = Math.sin(angle) * velocity;
            console.log(`dog fleeing vel : ${xVelAwayFromDog},${yVelAwayFromDog}`);
        }

        // Update the sheeps position
        let combinedXVel = xVelTowardHerd + xVelAwayFromDog;
        let combinedYVel = yVelTowardHerd + yVelAwayFromDog;
        if (combinedXVel === 0 && combinedYVel === 0) {
            this.moving = false;
        } else {
            this.moving = true;
            this.direction = Math.atan2(combinedYVel, combinedXVel);
        }
        this.xPos += combinedXVel;
        this.yPos += combinedYVel;
    }

    #getVelTowardsNeighbours(xCenter, yCenter) {
        let directionToNeighbours = Math.atan2(
            yCenter - this.yPos,
            xCenter - this.xPos);
        let velocity = this.anxiety * SHEEP_BASE_VELOCITY_TOWARDS_NEIGHBOURS;
        return [velocity * Math.cos(directionToNeighbours,
                velocity * Math.sin(directionToNeighbours))];
    }



}

export {Sheep};