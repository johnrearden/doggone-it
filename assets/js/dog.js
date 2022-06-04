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

        this.DISTANCE_PER_FRAME = 1;
    }

    /**
     * 
     * @param {*} x 
     * @param {*} y 
     */
    setDestination(x, y) {
        this.xDest = x;
        this.yDest = y
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
        let direction = this.#getDirectionToDestination();
    }

    /**
     * 
     * @returns 
     */
    #getDirectionToDestination() {
        return Math.atan2(this.yDest - this.yPos, this.xDest - this.xPos);
    }

}

export {Dog};