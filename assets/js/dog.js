import {
    getDistanceToPoint,
    getDirectionToPoint, getAngularDifference, Rectangle, rectContainsPoint, Point
} from "./utilities.js";

import {
    DOG_UNIT_MOVE,
    DOG_SLOWDOWN_RANGE
} from "./constants.js";

export class Dog {
    /**
     * A class representing a dog
     * @param {Number} xPos The x-coordinate of the dog's position 
     * @param {Number} yPos The y-coordinate of the dog's position 
     */
    constructor(xPos, yPos, obstacles) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.xDest = xPos;
        this.yDest = yPos;
        this.direction = 0;
        this.barking = false;
        this.moving = false;
        this.pointerDown = false;
        this.wayPoints = [];
        this.obstacleArray = [];
        for (let ob of obstacles) {
            let rectangle = new Rectangle(ob.x, 
                                          ob.y, 
                                          ob.x + ob.width,
                                          ob.y + ob.height);
            this.obstacleArray.push(rectangle);
        }
        console.log(this.obstacleArray);
    }

    /**
     * Updates the dog's position, called before each repaint
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

        // Reduce the dogs speed as he nears his final wayPoint. 
        let distToDestination = getDistanceToPoint(this.xPos, this.yPos, this.xDest, this.yDest);
        let distToTravel = DOG_UNIT_MOVE;
        if (distToDestination < DOG_SLOWDOWN_RANGE && this.wayPoints.length === 1) {
            distToTravel *= distToDestination / DOG_SLOWDOWN_RANGE
        }

        // Finally, update the dogs position.
        this.xPos += distToTravel * Math.cos(this.direction);
        this.yPos += distToTravel * Math.sin(this.direction);
    }

    /**
     * If the pointerDown flag is false, sets it to true and clears
     * the wayPoints array, as this is the beginning of a new path for
     * the dog.
     * @param {Number} x 
     * @param {Number} y 
     */
    onPointerDown(x, y) {
        if (!this.pointerDown) {
            this.pointerDown = true;
            this.wayPoints = [];
        }
    }

    /**
     * Adds the current pointer position to the end of the wayPoints array
     * @param {Number} x 
     * @param {Number} y 
     */
    onPointerMove(x, y) {
        if (this.pointerDown) {
            // Check if the point is within any of the obstacles
            let pointIsValid = true;
            for (let ob of this.obstacleArray) {
                if (rectContainsPoint(ob, new Point(x, y))) {
                    pointIsValid = false;
                    break;
                }
            }
            if (pointIsValid) {
                this.wayPoints.push([x, y]);
            } else {
                this.pointerDown = false;
            }
            
        }
    }

    /**
     * Sets the pointerDown flag to false, and adds the supplied point
     * to the wayPoints array. This also ensures that a pointer tap/click
     * without dragging will result in at least this one wayPoint
     * @param {Number} x 
     * @param {Number} y 
     */
    onPointerUp(x, y) {
        this.pointerDown = false;
        let pointIsValid = true;
            for (let ob of this.obstacleArray) {
                if (rectContainsPoint(ob, new Point(x, y))) {
                    pointIsValid = false;
                    break;
                }
            }
            if (pointIsValid) {
                this.wayPoints.push([x, y]);
            } 
    }

    /**
     * Makes the dog turn towards its destination
     */
    turnTowardsDestination() {
        // Calculate the direction the dog needs to travel in to head directly for
        // its destination, and turn towards this direction.
        let correctDirection = getDirectionToPoint(
            this.xPos,
            this.yPos,
            this.xDest,
            this.yDest);
        this.direction = correctDirection;
    }


    /**
     * @returns true if distance is less than an effective threshold, false otherwise.
     */
    arrivedAtNextWaypoint() {
        let distToNextWaypoint = getDistanceToPoint(this.xDest, this.yDest, this.xPos, this.yPos);
        return distToNextWaypoint <= DOG_UNIT_MOVE * 2;
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
