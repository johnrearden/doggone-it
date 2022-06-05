import { getAngularDifference } from "./utilities.js";

class Dog {
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

        this.DISTANCE_PER_FRAME = 3;
        this.ANGULAR_CHANGE_PER_FRAME = Math.PI / 24;
    }

    /**
     * Updates the dogs position, called before each repaint
     */
    update() {
        this.moveToDest();
    }

    /**
     * Sets the destination the dog is moving towards, based on where 
     * on the game-area the player has tapped/clicked.
     * @param {Number} x 
     * @param {Number} y 
     */
    setDestination(x, y) {
        this.xDest = x;
        this.yDest = y;
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
        if (this.#getDistanceToDestination() <= this.DISTANCE_PER_FRAME) {
            return;
        }
        let correctDirection = this.#getDirectionToDestination();
        let angularDifference = getAngularDifference(correctDirection, this.direction);

        // Check first to ensure the dog does not turn past the correct direction
        if (this.ANGULAR_CHANGE_PER_FRAME > Math.abs(angularDifference)) {
            this.direction = correctDirection;
        } else {
            this.direction += this.ANGULAR_CHANGE_PER_FRAME * Math.sign(angularDifference);
        }

        this.xPos += this.DISTANCE_PER_FRAME * Math.cos(this.direction);
        this.yPos += this.DISTANCE_PER_FRAME * Math.sin(this.direction);
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

export {Dog};