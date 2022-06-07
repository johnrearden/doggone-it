/**
 * Represents the distance within which a sheep considers another
 * sheep its neighbour.
 */
export const SHEEP_MAX_DIST_FROM_NEIGHBOURS = 100;


/**
 * Represents the maximum range a sheep will tolerate being from
 * the center of its nearest neighbours. This facilitates the herding 
 * behaviour.
 */
export const SHEEP_MAX_RANGE_FOR_NEIGHBOURS = 70;


/**
 * Represents the rate at which a sheep is able to turn.
 */
export const SHEEP_ANGULAR_CHANGE_PER_FRAME = Math.PI / 24;


/**
 * Represents the base speed (when least anxious) a sheep will travel
 * at in the direction of the center of its neighbours.
 */
export const SHEEP_VELOCITY_TOWARDS_NEIGHBOURS = 0.3;


/**
 * Represents the base speed (when least anxious) a sheep will travel 
 * at away from the dog.
 */
export const SHEEP_VELOCITY_AWAY_FROM_DOG = 3;

/**
 * Represents the range inside which the dog needs to be in order
 * for the sheep to react.
 */
export const SHEEP_OUTER_REACTION_LIMIT = 100;

/**
 * Represents the distance the dog can travel in one frame
 */
export const DOG_TRAVEL_PER_FRAME = 3;


/**
 * Represents the rate at which the dog is able to turn.
 */
export const DOG_ANGULAR_CHANGE_PER_FRAME = Math.PI / 20;
