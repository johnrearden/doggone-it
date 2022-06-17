/**
 * Represents the base speed (when least anxious) a sheep will travel
 * at in the direction of the center of its neighbours.
 */
export const SHEEP_VELOCITY_TOWARDS_HERD = 0.5;


/**
 * Represents the base speed (when least anxious) a sheep will travel 
 * at away from the dog.
 */
export const SHEEP_BASE_VELOCITY_AWAY_FROM_DOG = 1;


/**
 * Represents the fastest a sheep is able to move away from the dog.
 */
export const SHEEP_MAX_VELOCITY_AWAY_FROM_DOG = 6;

/**
 * Represents the range inside which the dog needs to be in order
 * for the sheep to react.
 */
export const SHEEP_OUTER_REACTION_LIMIT = 150;


/**
 * Represents the distance closer than which a sheep is no longer
 * attracted to the herd.
 */
export const SHEEP_MIN_DISTANCE_FROM_HERD = 150;


/**
 * Represents the distance the dog can travel in one frame
 */
export const DOG_UNIT_MOVE = 2.5;


/**
 * Represents the rate at which the dog is able to turn.
 */
export const DOG_UNIT_TURN = Math.PI / 4;


/**
 * Represents the distance at which the dog will start to
 * slow down when approaching his destination.
 */
export const DOG_SLOWDOWN_RANGE = 25;


/**
 * The width of the internal model field used by the game.
 */
export const FIELD_WIDTH = 400;


/**
 * The height of the internal model field used by the game.
 */
export const FIELD_HEIGHT = 500;


/**
 * The border around the edge of the field beyond which the 
 * game characters cannot go.
 */
export const FIELD_BORDER = 30;


/**
 * The number of frames between snaphots of the game recorded 
 * for action replay.
 */
export const REPLAY_SNAPSHOT_FREQUENCY = 1;