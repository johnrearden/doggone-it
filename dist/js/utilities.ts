/**
 * Gets the difference between the two angles provided in radians.
 * Adjusts for the discontinuity when the angles are on either side
 * of the negative x-axis, i.e. when one is between -PI/2 and -PI
 * and the other is between PI/2 and PI.
 * @param {Number} angleFrom in radians
 * @param {Number} angleTo in radians
 * @returns the difference between the parameters in radians
 */
export function getAngularDifference(angleTo: number, angleFrom: number): number {
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
 * Calculates the direction a game object should travel in to reach
 * the point (xTo, yTo) from its current position(xFrom, yFrom)
 *
 * @param {Number} xFrom
 * @param {Number} yFrom
 * @param {Number} xTo
 * @param {Number} yTo
 * @returns A direction (angle) such that -Math.PI <= angle <= Math.PI
 */
export function getDirectionToPoint(
    xFrom: number,
    yFrom: number,
    xTo: number,
    yTo: number): number {
    return Math.atan2(yTo - yFrom, xTo - xFrom);
}

/**
 * Calculates the distance between 2 points.
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @returns The distance between (x1, y1) and (x2, y2)
 */
export function getDistanceToPoint(
    x1: number,
    y1: number,
    x2: number,
    y2: number): number {
    let xDistSq = Math.pow(x2 - x1, 2);
    let yDistSq = Math.pow(y2 - y1, 2);
    return Math.sqrt(xDistSq + yDistSq);
}

/**
 * The Quadrant object is an Enum, which provides a finite set of named
 * directions, and the angles that form the boundaries between them. Each
 * Quadrant corresponds to an image of a game character facing in one
 * of four possible ways.
 */
export const Quadrant: Record<string, QuadrantType> = {
    EAST: {
        name: "east",
        min: -Math.PI * 0.25,
        max: Math.PI * 0.25
    },
    SOUTH: {
        name: "south",
        min: Math.PI * 0.25,
        max: Math.PI * 0.75,
    },
    NORTH: {
        name: "north",
        min: -Math.PI * 0.75,
        max: -Math.PI * 0.25
    },
    WEST: {
        name: "west",
        min: Math.PI * 0.75,
        max: -Math.PI * 0.75
    }
};

/**
 * Calculate the Quadrant that a supplied angle belongs to
 *
 * @param {Number} angle
 * @returns The Quadrant corresponding to the angle supplied
 */
export function getQuadrant(angle: number): QuadrantType {
    if (angle >= Quadrant.EAST.min && angle < Quadrant.EAST.max) {
        return Quadrant.EAST;
    }
    else if (angle >= Quadrant.SOUTH.min && angle < Quadrant.SOUTH.max) {
        return Quadrant.SOUTH;
    }
    else if (angle >= Quadrant.NORTH.min && angle < Quadrant.NORTH.max) {
        return Quadrant.NORTH;
    }
    else {
        return Quadrant.WEST;
    }
}

/**
 * Returns a value between -Math.PI and Math.PI, by recursively adding or subtracting
 * Math.PI (depending on whether the angle is below or above the range).
 * @param {Number} angle
 * @returns
 */
export function ensureCorrectRange(angle: number): number {
    if (angle > Math.PI) {
        return ensureCorrectRange(angle - Math.PI * 2);
    }
    else if (angle < -Math.PI) {
        return ensureCorrectRange(angle + Math.PI * 2);
    }
    else {
        return angle;
    }
}

/**
 * Tests if the point supplied is within the rectangle supplied.
 * @param {Rectangle} rect
 * @param {Point} point
 * @returns true if the point is contained within the rectangle
 */
export function rectContainsPoint(rect: Rectangle, point: Point): boolean {
    let isContained = true;
    if (point.x > rect.right || point.x < rect.left) {
        isContained = false;
    }
    if (point.y > rect.bottom || point.y < rect.top) {
        isContained = false;
    }
    return isContained;
}

/**
 * A class representing a point
 */
export class Point {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

/**
 * A class representing a rectangle
 */
export class Rectangle {
    left: number;
    top: number;
    right: number;
    bottom: number;

    constructor(left: number, top: number, right: number, bottom: number) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }
}

/**
 * Utility method to display an array of HTML elements.
 * @param {Array} array of HTML id attributess
 */
export function show(array: string[]) {
    for (let i = 0; i < array.length; i++) {
        const el = document.getElementById(array[i]);
        if (el) {
            el.style.display = "initial";
        }
    }
}
/**
 * Utility method to display an array of HTML elements.
 * @param {Array} array of HTML id attributes
 */
export function hide(array: string[]) {
    for (let i = 0; i < array.length; i++) {
        const el = document.getElementById(array[i]);
        if (el) {
            el.style.display = "none";
        }
    }
}
/**
 * Utility method to show a string to the player
 * @param {String} message to be displayed
 */
export function showMessage(message: string) {
    let displayText = document.getElementById("end-level-message");
    if (displayText) {
        displayText.innerText = message;
    }
}
