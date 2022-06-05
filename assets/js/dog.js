class Dog {
    /**
     * 
     * @param {*} xPos 
     * @param {*} yPos 
     */
    constructor(xPos, yPos) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.xDest = xPos;
        this.yDest = yPos;
        this.direction = 0;
        this.barking = false;

        this.DISTANCE_PER_FRAME = 2;
    }

    /**
     * 
     */
    update() {
        this.moveToDest();
    }

    /**
     * 
     * @param {*} x 
     * @param {*} y 
     */
    setDestination(x, y) {
        this.xDest = Math.round(x);
        this.yDest = Math.round(y);
    }

    /**
     * 
     * @param {*} bool 
     */
    shouldBark(bool) {
        this.barking = bool;
    }

    /**
     * 
     */
    moveToDest() {
        // Check to see if the dog is within one frame's travel of 
        // reaching the destination (to avoid thrashing).
        if (this.#getDistanceToDestination() <= this.DISTANCE_PER_FRAME) {
            return;
        }
        this.direction = this.#getDirectionToDestination();
        this.xPos += this.DISTANCE_PER_FRAME * Math.cos(this.direction);
        this.yPos += this.DISTANCE_PER_FRAME * Math.sin(this.direction);
    }

    /**
     * 
     * @returns 
     */
    #getDirectionToDestination() {
        return Math.atan2(this.yDest - this.yPos, this.xDest - this.xPos);
    }

    #getDistanceToDestination() {
        return Math.sqrt(
            Math.pow(this.xDest - this.xPos, 2) +
            Math.pow(this.yDest - this.yPos, 2));
    }
}

export {Dog};