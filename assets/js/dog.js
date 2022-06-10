// import {
//     getAngularDifference
// } from "./utilities.js";
// import {
//     DOG_ANGULAR_CHANGE_PER_FRAME,
//     DOG_TRAVEL_PER_FRAME,
//     DOG_SLOWDOWN_RANGE
// } from './constants.js';

module.exports = class Dog {
    /**
     * A class representing a dog
     * @param {Number} xPos The x-coordinate of the dog's position 
     * @param {Number} yPos The y-coordinate of the dog's position 
     */
    constructor(xPos, yPos) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.xDest = xPos;
        this.yDest = yPos;
        this.direction = 0;
        this.barking = false;
        this.moving = false;
        this.pointerDown = false;
        this.destinations = [];
    }

    /**
     * Updates the dogs position, called before each repaint
     */
    update() {
        this.setDestination();
        this.moveToDest();
        
    }

    /**
     * Sets the destination the dog is moving towards.
     */
    setDestination(destinationArray) {
        if (this.destinations.length > 0) {
            this.xDest = destinationArray[0][0];
            this.yDest = destinationArray[0][1];
        }
    }

    /**
     * Sets a flag indicating whether the dog is barking or not.
     * @param {Boolean} bool 
     */
    shouldBark(bool) {
        this.barking = bool;
    }

    /**
     * Moves the dog in the direction of its destination. 
     */
    moveToDest() {
        // Don't move if the dog is within one frame's travel of 
        // reaching the destination (to avoid thrashing).
        if (this.#getDistanceToDestination() <= DOG_TRAVEL_PER_FRAME * 2) {
            this.destinations.shift();
            if (this.destinations.length <= 1) {
                this.moving = false;
                return;
            } else {
                this.xDest = this.destinations[0][0];
                this.yDest = this.destinations[0][1];
            }

        }
        this.moving = true;
        let correctDirection = this.#getDirectionToDestination();
        let angularDifference = getAngularDifference(correctDirection, this.direction);

        // Check first to ensure the dog does not turn past the correct direction
        if (DOG_ANGULAR_CHANGE_PER_FRAME > Math.abs(angularDifference)) {
            this.direction = correctDirection;
        } else {
            this.direction += DOG_ANGULAR_CHANGE_PER_FRAME * Math.sign(angularDifference);
        }

        let distToTravel = DOG_TRAVEL_PER_FRAME;
        let distToDestinationSq = Math.pow(this.xDest - this.xPos, 2) +
            Math.pow(this.yDest - this.yPos, 2);
        let distToDestination = Math.sqrt(distToDestinationSq);

        // Reduce the dogs travel distance as he nears his final destination. 
        if (distToDestination < DOG_SLOWDOWN_RANGE && this.destinations.length === 1) {
            distToTravel *= distToDestination / DOG_SLOWDOWN_RANGE
        }

        this.xPos += distToTravel * Math.cos(this.direction);
        this.yPos += distToTravel * Math.sin(this.direction);
    }

    onPointerDown(x, y) {
        if (!this.pointerDown) {
            this.pointerDown = true;
            this.destinations = [];
        }
    }

    onPointerMove(x, y) {
        if (this.pointerDown) {
            this.destinations.push([x, y]);
        }
    }

    onPointerUp(x, y) {
        this.pointerDown = false;
        if (this.destinations.length === 0){
            this.destinations.push([x, y]);
        }
    }

    /**
     * This private method calculates the direction the dog should point in to travel directly
     * towards its destination.
     * @returns a number representing the direction the dog is pointing, between -PI and PI.
     */
    #getDirectionToDestination() {
        return Math.atan2(this.yDest - this.yPos, this.xDest - this.xPos);
    }

    /**
     * This method calculates how far the dog is from its destination.
     * @returns The absolute distance of the dog from its destination.
     */
    #getDistanceToDestination() {
        return Math.sqrt(
            Math.pow(this.xDest - this.xPos, 2) +
            Math.pow(this.yDest - this.yPos, 2));
    }
}

// export {
    // Dog
// };