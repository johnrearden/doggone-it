import {
    getDistanceToPoint,
    getDirectionToPoint, getAngularDifference
} from "./utilities.js";

import {
    DOG_TRAVEL_PER_FRAME,
    DOG_ANGULAR_CHANGE_PER_FRAME,
    DOG_SLOWDOWN_RANGE
} from "./constants.js";

export class Dog {
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
        this.wayPoints = [];
    }

    /**
     * Updates the dogs position, called before each repaint
     */
    update() {
        this.moveToDest();
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

        // If the wayPoints array is not empty, assign wayPoints[0] as the
        // next destination.
        if (this.wayPoints.length > 0) {
            [this.xDest, this.yDest] = this.wayPoints[0];
            this.moving = true;
        }

        // Check if the dog has arrived at the next waypoint. If so, remove the
        // waypoint. If there are no more waypoints, return immediately.
        if (this.arrivedAtNextWaypoint()) {
            this.wayPoints.shift();
            if (!this.hasNextWaypoint()) {
                this.moving = false;
                return;
            } else {
                this.assignNextDestination();
                this.moving = true;
            }
        }

        this.turnTowardsDestination();

        // Reduce the dogs travel distance as he nears his final wayPoint. 
        let distToDestination = getDistanceToPoint(this.xPos, this.yPos, this.xDest, this.yDest);
        let distToTravel = DOG_TRAVEL_PER_FRAME;
        if (distToDestination < DOG_SLOWDOWN_RANGE && this.wayPoints.length === 1) {
            distToTravel *= distToDestination / DOG_SLOWDOWN_RANGE
        }

        // Finally, update the dogs position.
        this.xPos += distToTravel * Math.cos(this.direction);
        this.yPos += distToTravel * Math.sin(this.direction);
    }

    onPointerDown(x, y) {
        if (!this.pointerDown) {
            this.pointerDown = true;
            this.wayPoints = [];
        }
    }

    onPointerMove(x, y) {
        if (this.pointerDown) {
            this.wayPoints.push([x, y]);
        }
    }

    onPointerUp(x, y) {
        this.pointerDown = false;
        this.wayPoints.push([x, y]);
    }

    turnTowardsDestination() {
        // Calculate the direction the dog needs to travel in to head directly for
        // its destination, and turn towards this direction.
        let correctDirection = getDirectionToPoint(this.xPos, this.yPos, this.xDest, this.yDest);
        let angularDifference = getAngularDifference(correctDirection, this.direction);

        // Check first to ensure the dog does not turn past the correct direction
        if (DOG_ANGULAR_CHANGE_PER_FRAME > Math.abs(angularDifference)) {
            this.direction = correctDirection;
        } else {
            this.direction += DOG_ANGULAR_CHANGE_PER_FRAME * Math.sign(angularDifference);
        }
    }


    /**
     * @returns true if distance < constants.DOG_TRAVEL_PER_FRAME, false otherwise.
     */
    arrivedAtNextWaypoint() {
        let distToNextWaypoint = getDistanceToPoint(this.xDest, this.yDest, this.xPos, this.yPos);
        return distToNextWaypoint <= DOG_TRAVEL_PER_FRAME * 2;
    }

    /**
     * 
     * @returns true if the destination array has at least one element.
     */
    hasNextWaypoint() {
        return this.wayPoints.length > 0;
    }

    /**
     * Assigns the last element in the destinations array as the current destination.
     */
    assignNextDestination() {
        this.xDest = this.wayPoints[0][0];
        this.yDest = this.wayPoints[0][1];
    }
}
