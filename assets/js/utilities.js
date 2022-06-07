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

const ensureCorrectRange = (angle) => {
    if (angle > Math.PI) {
        angle -= Math.PI * 2;
    } else if (angle < -Math.PI) {
        angle += Math.PI * 2;
    }
    return angle;
}

export {getAngularDifference, Quadrant, getQuadrant, ensureCorrectRange}