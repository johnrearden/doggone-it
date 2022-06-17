import {
    SHEEP_OUTER_REACTION_LIMIT,
    SHEEP_BASE_VELOCITY_AWAY_FROM_DOG,
    SHEEP_VELOCITY_TOWARDS_HERD,
    FIELD_BORDER, FIELD_HEIGHT, FIELD_WIDTH,
    SHEEP_MAX_VELOCITY_AWAY_FROM_DOG,
    SHEEP_MIN_DISTANCE_FROM_HERD
} from "./constants.js";
import {
    ensureCorrectRange, getDirectionToPoint,
    getDistanceToPoint, Point, Rectangle, rectContainsPoint
} from "./utilities.js";


export class Sheep {
    /**
     * Represents a sheep, with a velocity and direction. The sheep also
     * has an anxiety field, which affects how the sheep reacts to the
     * dog and the other members of its herd.
     * 
     * @param {Number} xPos 
     * @param {Number} yPos 
     */
    constructor(xPos, yPos, id, isLamb) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.direction = 0;
        this.velocity = 0;
        this.anxiety = 1;
        this.id = id;
        this.moving = false;
        this.isLamb = isLamb
    }

    /**
     * Updates the sheep's attributes based on the location of the dog, and of
     * the location of the center of the herd.
     * 
     * @param {Number} herdXCenter 
     * @param {Number} herdYCenter 
     * @param {Dog} dog 
     */
    update(herdXCenter, herdYCenter, dog, obstacles) {

        // Calculate the sheeps velocity towards the center of the herd
        let xHerdVel, yHerdVel;
        [xHerdVel, yHerdVel] = this.getVelocityTowardHerd(herdXCenter, herdYCenter);

        // Calculate the sheeps velocity away from the dog.
        let xDogVel, yDogVel;
        [xDogVel, yDogVel] = this.getVelocityAwayFromDog(dog);

        // Sum the velocities and update the sheeps position
        let combinedXVel = xHerdVel + xDogVel;
        let combinedYVel = yHerdVel + yDogVel;
        if (Math.abs(combinedXVel) <= 1 && Math.abs(combinedYVel) <= 1) {
            this.moving = false;
            this.direction = Math.atan2(combinedYVel, combinedXVel);
            combinedXVel = 0;
            combinedYVel = 0;
        } else {
            this.moving = true;
            this.direction = Math.atan2(combinedYVel, combinedXVel);
        }

        // Ensure the calculated move will not result in the sheep entering
        // any of the obstacles in this level
        [combinedXVel, combinedYVel] = this.checkMoveForObstacles(
            combinedXVel,
            combinedYVel,
            obstacles);

        // Update the sheep's position
        this.xPos += combinedXVel;
        this.yPos += combinedYVel;

        // Ensure the sheep has not left the game area
        this.checkGameAreaBounds();
    }

    /**
     * Calculates the sheeps velocity toward the center of the herd, 
     * based on the herd's position and the anxiety level of the sheep.
     * 
     * @param {Number} herdXCenter 
     * @param {Number} herdYCenter 
     * @returns an array containing the x and y velocity components.
     */
    getVelocityTowardHerd(herdXCenter, herdYCenter) {
        let distToHerd = getDistanceToPoint(this.xPos, this.yPos, herdXCenter, herdYCenter);
        if (distToHerd > SHEEP_MIN_DISTANCE_FROM_HERD) {
            let directionToHerdCenter = getDirectionToPoint(
                this.xPos,
                this.yPos,
                herdXCenter,
                herdYCenter);

            let velocity = this.anxiety * SHEEP_VELOCITY_TOWARDS_HERD;
            return [velocity * Math.cos(directionToHerdCenter),
            velocity * Math.sin(directionToHerdCenter)];
        } else {
            return [0, 0];
        }
    }

    /**
     * Calculates the sheep's velocity away from the dog. The sheep is indifferent
     * to the dog outside of the range SHEEP_OUTER_REACTION_LIMIT, and its velocity away
     * from the dog is proportional to its distance within that range, up to a limit
     * of SHEEP_MAX_VELOCITY_AWAY_FROM_DOG
     * 
     * @param {Dog} dog 
     * @returns an array containing the x and y velocity components.
     */
    getVelocityAwayFromDog(dog) {
        let reactionRange = SHEEP_OUTER_REACTION_LIMIT;
        let xVel = 0;
        let yVel = 0;
        if (dog.barking) {
            reactionRange *= 2;
        }


        // Compare the squares of the distances (it's not necessary to compute the
        // square root also before deciding if the dog is within range - that's 
        // an expensive operation).
        let dogXDistSq = Math.pow(dog.xPos - this.xPos, 2);
        let dogYDistSq = Math.pow(dog.yPos - this.yPos, 2);
        if (dogXDistSq + dogYDistSq < Math.pow(reactionRange, 2)) {

            // The sheep is within reaction range. Its speed away from the dog depends
            // on how far away it is, hitting a maximum if the dog is within 30.
            let dist = Math.sqrt(dogXDistSq + dogYDistSq);

            // The sheep moves away at a speed proportional to the dogs closeness.
            let multiplier = SHEEP_OUTER_REACTION_LIMIT / dist;
            let velocity = SHEEP_BASE_VELOCITY_AWAY_FROM_DOG * multiplier;
            if (velocity > SHEEP_MAX_VELOCITY_AWAY_FROM_DOG) {
                velocity = SHEEP_MAX_VELOCITY_AWAY_FROM_DOG;
            }
            let angle = getDirectionToPoint(this.xPos, this.yPos, dog.xPos, dog.yPos);
            // Reverse the angle so that the sheep moves away.
            angle = ensureCorrectRange(angle + Math.PI);
            xVel = Math.cos(angle) * velocity;
            yVel = Math.sin(angle) * velocity;
        }
        return [xVel, yVel];
    }

    /**
     * Checks if the sheep has left the game-area, and unless it has left via the gate, 
     * returns it to the edge of the game-area again.
     */
    checkGameAreaBounds() {
        if (this.xPos < FIELD_BORDER) {
            this.xPos = FIELD_BORDER;
        } else if (this.xPos > FIELD_WIDTH - FIELD_BORDER) {
            this.xPos = FIELD_WIDTH - FIELD_BORDER;
        }
        if (this.yPos < FIELD_BORDER && (this.xPos < 165 || this.xPos > 235)) {
            this.yPos = FIELD_BORDER;
        } else if (this.yPos > FIELD_HEIGHT - FIELD_BORDER) {
            this.yPos = FIELD_HEIGHT - FIELD_BORDER;
        }
    }

    /**
     * Ensures that the sheep does not enter an area of the level occupied by 
     * an obstacle.
     * @param {Number} xVel The x velocity calculated for the current move
     * @param {Number} yVel The y velocity calculated for the current move
     * @returns the x and y velocities adjusted to avoid entering an obstacle
     */
    checkMoveForObstacles(xVel, yVel, obstacles) {
        let futureX = this.xPos + xVel;
        let futureY = this.yPos + yVel;
        for (let obstacle of obstacles) {
            let rect = new Rectangle(
                obstacle.x,
                obstacle.y,
                obstacle.x + obstacle.width,
                obstacle.y + obstacle.height);
            if (rectContainsPoint(rect, new Point(futureX, futureY))) {
                // Try keeping the current xPosition unchanged
                if (!rectContainsPoint(rect, new Point(this.xPos, futureY))) {
                    return [0, yVel];
                }
                // If that doesn't work, try keeping the current yPosition unchanged
                if (!rectContainsPoint(rect, new Point(futureX, this.yPos))) {
                    return [yVel, 0];
                }
                // Last resort, keep both unchanged
                return [0, 0];

            }
        }
        return [xVel, yVel];
    }
}