/**
 * Gets the difference between the two angles provided in radians.
 * Adjusts for the discontinuity when the angles are on either side
 * of the negative x-axis, i.e. when one is between -PI/2 and -PI 
 * and the other is between PI/2 and PI.
 * @param {Number} angleFrom in radians
 * @param {Number} angleTo in radians
 * @returns the difference between the parameters in radians
 */
const getAngularDifference = (angleTo, angleFrom) => {
    let difference = angleTo - angleFrom;
    if (difference > Math.PI) {
        difference -= 2 * Math.PI;
    }
    if (difference < -Math.PI) {
        difference += 2 * Math.PI;
    }
    
    return difference;
}



/**
 * Calculates the distance between 2 points.
 * @param {Number} x1 
 * @param {Number} y1 
 * @param {Number} x2 
 * @param {Number} y2 
 * @returns The distance between (x1, y1) and (x2, y2)
 */
const getDistanceToPoint = (x1, y1, x2, y2) => {
    let xDistSq = Math.pow(x2 - x1, 2);
    let yDistSq = Math.pow(y2 - y1, 2);
    return Math.sqrt(xDistSq + yDistSq);
}

const Quadrant = {
    EAST: {
        min: -Math.PI * 0.25,
        max: Math.PI * 0.25
    },
    SOUTH: {
        min: Math.PI * 0.25,
        max: Math.PI * 0.75,
    },
    NORTH: {
        min: -Math.PI * 0.75,
        max: -Math.PI * 0.25
    },
    WEST: {
        min: Math.PI * 0.75,
        max: -Math.PI * 0.75
    }
}

const getQuadrant = (angle) => {
    if (angle >= Quadrant.EAST.min && angle < Quadrant.EAST.max) {
        return Quadrant.EAST;
    } else if (angle >= Quadrant.SOUTH.min && angle < Quadrant.SOUTH.max) {
        return Quadrant.SOUTH;
    } else if (angle >= Quadrant.NORTH.min && angle < Quadrant.NORTH.max) {
        return Quadrant.NORTH;
    } else {
        return Quadrant.WEST;
    }
}

/**
 * Returns a value between -Math.PI and Math.PI, by recursively adding or subtracting
 * Math.PI (depending on whether the angle is below or above the range).
 * @param {Number} angle 
 * @returns 
 */
const ensureCorrectRange = (angle) => {
    if (angle > Math.PI) {
        return ensureCorrectRange(angle - Math.PI * 2);
    } else if (angle < -Math.PI) {
        return ensureCorrectRange(angle + Math.PI * 2);
    } else {
        return angle;
    }
}

module.exports = {
    ensureCorrectRange,
    getDistanceToPoint,
    getAngularDifference,
    Quadrant,
    getQuadrant
}