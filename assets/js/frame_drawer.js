import { getQuadrant, Quadrant } from "./utilities.js";

export const drawFrame = (dog, herd, frameCount, sprites) => {
    let gameCanvas = document.getElementById('game-area');
    let context;
    if (gameCanvas) {
        context = gameCanvas.getContext('2d');
    }

    // If the pointer is down, draw the dog's path
    if (dog.wayPoints.length > 0 && dog.pointerDown) {
        context.strokeStyle = 'white';
        context.lineWidth = 5;
        context.beginPath();
        context.moveTo(dog.xPos, dog.yPos);
        for (let i = 0; i < dog.wayPoints.length; i++) {
            context.lineTo(
                dog.wayPoints[i][0],
                dog.wayPoints[i][1]);
        }
        context.stroke();
    }

    // Pick the correct directional dog sprite from South, West, North, East
    let quadrant = getQuadrant(dog.direction);
    let [index, adjustedAngle] = getIndexAndAdjustedAngle(quadrant, dog.direction);

    // Pick the correct sprite leg position based on the frame count
    let indexOffset;
    if (!dog.moving) {
        indexOffset = 2;
    } else {
        indexOffset = getSpriteFrame(frameCount);
    }
    let correctSprite = sprites.dog.images[index + indexOffset];

    // Draw the dog.
    drawSprite(
        context,
        correctSprite,
        Math.floor(dog.xPos),
        Math.floor(dog.yPos),
        adjustedAngle,
        0.8);

    // If the pointer is down, draw the dog's destination
    if (dog.pointerDown) {
        context.fillStyle = 'white';
        context.fillRect(dog.xDest - 2, dog.yDest - 2, 5, 5);
    }

    // Draw the herd
    for (let i = 0; i < herd.xArray.length; i++) {
        let sheep = herd.xArray[i];

        // Pick the correct directional sheep sprite from South, West, North, East
        let quadrant = getQuadrant(sheep.direction);
        let [index, adjustedAngle] = getIndexAndAdjustedAngle(
                                        quadrant, 
                                        sheep.direction);

        // Pick the correct sprite leg position based on the frame count
        if (!sheep.moving) {
            indexOffset = 2;
        } else {
            indexOffset = getSpriteFrame(frameCount);
        }
        let correctSprite = sprites.sheep.images[index + indexOffset];

        // Calculate the scale based on whether this sheep is a lamb or not
        let scale = sheep.isLamb ? 0.7 : 1.0;

        // Draw this sheep
        drawSprite(
            context,
            correctSprite,
            sheep.xPos,
            sheep.yPos,
            adjustedAngle,
            scale
        );
    }
};

/**
 * Draws a sprite image on a supplied context, rotating the context so
 * as to draw the sprite pointing in the appropriate direction.
 * @param {Context} context 
 * @param {Image} image 
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} angle 
 * @param {Number} scale The ratio of the drawn size to the original image size
 */
export const drawSprite = (context, image, x, y, angle, scale) => {
    if (image) {
        let imgWidth = image.width * scale;
        let imgHeight = image.height * scale;
        context.save();
        context.translate(x, y);
        context.rotate(angle);
        context.drawImage(
            image,
            -imgWidth / 2, -imgHeight / 2,
            imgWidth, imgHeight);
        context.restore();
    }
};

/**
 * Takes the integer frameCount since the start of the game modulo 20, 
 * and chooses whether the left leg of the animal should be leading, the
 * right leg should be leading, or the two legs should be together.
 * 
 * This creates a walking effect by alternating the leg positions as
 * the frames progress.
 * 
 * @param {Integer} frameCount 
 * @returns an integer offset used to choose the correct sprite
 */
const getSpriteFrame = (frameCount) => {
    let modulus = frameCount % 20;
    if (modulus < 5) {
        return 0;
    } else if (modulus >= 10 && modulus < 15) {
        return 1;
    } else {
        return 2;
    }
};

/**
 * Takes a quadrant value and calculates which sprite is the correct one
 * to display. There are four different classes of sprite - one for each direction
 * of the compass.
 * 
 * As these sprites do not all face in the same direction, an angle offset is 
 * calculated to compensate.
 * 
 * @param {Enum : Quadrant} quadrant 
 * @returns index : the base index of the correct sprite
 * @returns angleOffset : the adjustment to the sprites direction.
 */
export const getIndexAndAdjustedAngle = (quadrant, direction) => {
    let index, adjustedAngle;
    switch (quadrant) {
        case Quadrant.SOUTH: {
            index = 0;
            adjustedAngle = direction - Math.PI / 2;
            break;
        }
        case Quadrant.WEST: {
            index = 3;
            adjustedAngle = 0;
            break;
        }
        case Quadrant.NORTH: {
            index = 6;
            adjustedAngle = direction + Math.PI / 2;
            break;
        }
        case Quadrant.EAST:
        default: {
            index = 9;
            adjustedAngle = 0;
        }
    }
    return [index, adjustedAngle];
};