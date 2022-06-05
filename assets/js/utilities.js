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

export {getAngularDifference}