/**
 * Represents the distance within which a sheep considers another
 * sheep its neighbour.
 */
const SHEEP_NEIGHBOURLY_DISTANCE = 300;


/**
 * Represents the furthest a sheep will tolerate being from
 * the center of its nearest neighbours. This facilitates the herding 
 * behaviour.
 */
const SHEEP_MAX_RANGE_FOR_NEIGHBOURS = 20;


/**
 * Represents the closest a sheep will tolerate being from the center of
 * its nearest neighbours.
 */
const SHEEP_MIN_RANGE_FOR_NEIGHBOURS = 100;


/**
 * Represents the base speed (when least anxious) a sheep will travel
 * at in the direction of the center of its neighbours.
 */
const SHEEP_VELOCITY_TOWARDS_NEIGHBOURS = 1;


/**
 * Represents the base speed (when least anxious) a sheep will travel 
 * at away from the dog.
 */
const SHEEP_VELOCITY_AWAY_FROM_DOG = 5;


/**
 * Represents the range inside which the dog needs to be in order
 * for the sheep to react.
 */
const SHEEP_OUTER_REACTION_LIMIT = 150;


/**
 * Represents the distance the dog can travel in one frame
 */
const DOG_TRAVEL_PER_FRAME = 2.5;


/**
 * Represents the rate at which the dog is able to turn.
 */
const DOG_ANGULAR_CHANGE_PER_FRAME = Math.PI / 8;


/**
 * Represents the distance at which the dog will start to
 * slow down when approaching his destination.
 */
const DOG_SLOWDOWN_RANGE = 25;


/**
 * The width of the internal model field used by the game.
 */
const FIELD_WIDTH = 400;


/**
 * The height of the internal model field used by the game.
 */
const FIELD_HEIGHT = 500;


/**
 * The border around the edge of the field beyond which the 
 * game characters cannot go.
 */
const FIELD_BORDER = 30;