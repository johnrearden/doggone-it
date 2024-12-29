import { 
    getDistanceToPoint,
    getDirectionToPoint,
    Rectangle,
    rectContainsPoint,
    Point
} from "./utilities";

import {
    DOG_UNIT_MOVE,
    DOG_SLOWDOWN_RANGE,
    FIELD_BORDER,
    FIELD_WIDTH,
    FIELD_HEIGHT
} from "./constants";


export class Dog {
    /**
     * A class representing a dog
     * @param {Number} xPos The x-coordinate of the dog's position
     * @param {Number} yPos The y-coordinate of the dog's position
     */
    xPos: number;
    yPos: number;
    xDest: number;
    yDest: number;
    direction: number;
    unitMove: number;
    moving: boolean;
    pointerDown: boolean;
    wayPoints: number[][];
    obstacleArray: Rectangle[];

    constructor(xPos: number, yPos: number, obstacles: Obstacle[]) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.xDest = xPos;
        this.yDest = yPos;
        this.direction = 0;
        this.unitMove = DOG_UNIT_MOVE;
        this.moving = false;
        this.pointerDown = false;
        this.wayPoints = [];
        this.obstacleArray = [];
        for (let ob of obstacles) {
            let rectangle = new Rectangle(ob.x, ob.y, ob.x + ob.width, ob.y + ob.height);
            this.obstacleArray.push(rectangle);
        }
    }
    /**
     * Updates the dog's position, called before each repaint
     */
    update() {
        this.moveToDest();
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
            }
            else {
                this.assignNextDestination();
                this.moving = true;
            }
        }
        this.turnTowardsDestination();
        // Reduce the dogs speed as he nears his final wayPoint. 
        let distToDestination = getDistanceToPoint(this.xPos, this.yPos, this.xDest, this.yDest);
        let distToTravel = this.unitMove;
        if (distToDestination < DOG_SLOWDOWN_RANGE && this.wayPoints.length === 1) {
            distToTravel *= distToDestination / DOG_SLOWDOWN_RANGE;
        }
        let xVel = distToTravel * Math.cos(this.direction);
        let yVel = distToTravel * Math.sin(this.direction);
        // Ensure the calculated move will not result in the dog entering
        // any of the obstacles in this level
        [xVel, yVel] = this.checkMoveForObstacles(xVel, yVel);
        // Finally, update the dogs position.
        this.xPos += xVel;
        this.yPos += yVel;
    }

    /**
     * Sets the pointerDown flag to true, and clears the wayPoints array
     */	
    onPointerDown() {
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
    onPointerMove(x: number, y: number) {
        if (this.pointerDown && this.checkWaypointIsValid(x, y, this.obstacleArray)) {
            this.wayPoints.push([x, y]);
        }
    }

    /**
     * Sets the pointerDown flag to false, and adds the supplied point
     * to the wayPoints array. This also ensures that a pointer tap/click
     * without dragging will result in at least this one wayPoint
     * @param {Number} x
     * @param {Number} y
     */
    onPointerUp(x: number, y: number) {
        this.pointerDown = false;
        if (this.checkWaypointIsValid(x, y, this.obstacleArray)) {
            this.wayPoints.push([x, y]);
        }
    }

    /**
     * Makes the dog turn towards its destination
     */
    turnTowardsDestination() {
        // Calculate the direction the dog needs to travel in to head directly for
        // its destination, and turn towards this direction.
        let correctDirection = getDirectionToPoint(this.xPos, this.yPos, this.xDest, this.yDest);
        this.direction = correctDirection;
    }

    /**
     * Checks if the dog has arrived at the next waypoint
     *
     * @returns true if distance is less than an effective threshold, false otherwise.
     */
    arrivedAtNextWaypoint() {
        let distToNextWaypoint = getDistanceToPoint(this.xDest, this.yDest, this.xPos, this.yPos);
        return distToNextWaypoint <= this.unitMove * 2;
    }

    /**
     * Checks if the dog has a waypoint to head for
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

    /**
     * Ensures that the dog does not enter an area of the level occupied by
     * an obstacle.
     * @param {Number} xVel The x velocity calculated for the current move
     * @param {Number} yVel The y velocity calculated for the current move
     * @returns the x and y velocities adjusted to avoid entering an obstacle
     */
    checkMoveForObstacles(xVel: number, yVel: number) {
        let futureX = this.xPos + xVel;
        let futureY = this.yPos + yVel;
        for (let obstacle of this.obstacleArray) {
            if (rectContainsPoint(obstacle, new Point(futureX, futureY))) {
                // Try keeping the current xPosition unchanged
                if (!rectContainsPoint(obstacle, new Point(this.xPos, futureY))) {
                    return [0, yVel];
                }
                // If that doesn't work, try keeping the current yPosition unchanged
                if (!rectContainsPoint(obstacle, new Point(futureX, this.yPos))) {
                    return [yVel, 0];
                }
                // Last resort, keep both unchanged
                return [0, 0];
            }
        }
        return [xVel, yVel];
    }

    /**
     * Checks that a potential waypoint does not overlap with any of the obstacles
     * in this level, and also that it falls within the borders of the game area,
     * including the fences.
     * @param {number} x
     * @param {number} y
     * @param {Obstacle[]} obstacleArray
     * @returns true if waypoint is valid, false otherwise
     */
    checkWaypointIsValid(x: number, y: number, obstacleArray: Rectangle[]) {
        // Check if the point is within any of the obstacles
        for (let ob of obstacleArray) {
            if (rectContainsPoint(ob, new Point(x, y))) {
                return false;
            }
        }
        // Check that the point is within the fences on the game area
        if (x < FIELD_BORDER || x > FIELD_WIDTH - FIELD_BORDER ||
            y < FIELD_BORDER || y > FIELD_HEIGHT - FIELD_BORDER) {
            return false;
        }
        // Point is valid - return true
        return true;
    }

    /**
     * Attaches an event (change) listener to the dog-speed slider in settings,
     * to enable the player to experiment with different values for the
     * unitMove variable
     */
    setSliderEventListener() {
        let slider = document.getElementById("dog-speed") as HTMLInputElement;
        // As well as attaching the listener, read the current value
        // and set the unitMove variable accordingly.
        if (slider) {
            this.unitMove = DOG_UNIT_MOVE * Number(slider.value);
            // Attach the listener
            slider.addEventListener('change', () => {
                this.unitMove = DOG_UNIT_MOVE * Number(slider.value);
            });
        }
        
        
    }
}
