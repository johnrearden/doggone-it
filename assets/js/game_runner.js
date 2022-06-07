import {
    Quadrant,
    getQuadrant
} from './utilities.js';

function GameRunner(sprites, dog, herd) {
    this.sprites = sprites;
    this.dog = dog;
    this.herd = herd;
    this.frameCount = 0;
    console.log(dog);

    // This is the callback passed to window.requestAnimationFrame, 
    // and needs to be explicitly bound to the GameRunner object, 
    // otherwise 'this' will refer to the window object from the 
    // requestAnimationFrame() scope.
    this.updateGame = (function () {
        if (++this.frameCount % 1 === 0) {
            this.dog.update();
            this.herd.update(dog);
            this.drawFrame();
        }

        // Request the next frame, passing the updageGame function as the callback.
        window.requestAnimationFrame(this.updateGame);
    }).bind(this);

    this.drawFrame = function () {
        let gameCanvas = document.getElementById('game-area');
        let context = gameCanvas.getContext('2d');

        // Redraw an empty field.
        context.fillStyle = 'green';
        context.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

        // Pick the correct directional sprite from South, West, North, East
        let quadrant = getQuadrant(this.dog.direction);
        let [index, adjustedAngle] = this.getIndexAndAdjustedAngle(quadrant, this.dog.direction);

        // Pick the correct sprite leg position based on the frame count
        let indexOffset;
        if (!this.dog.moving) {
            indexOffset = 2;
        } else {
            indexOffset = this.getSpriteFrame(this.frameCount);
        }
        let correctSprite = this.sprites.dog.images[index + indexOffset];

        // Draw the dog.
        this.drawSprite(
            context,
            correctSprite,
            Math.floor(this.dog.xPos),
            Math.floor(this.dog.yPos),
            adjustedAngle);

        // Draw the dog's destination
        context.fillStyle = 'red';
        context.fillRect(this.dog.xDest - 2, this.dog.yDest - 2, 5, 5);

        // Draw the herd
        for (let i = 0; i < herd.xArray.length; i++) {
            let sheep = herd.xArray[i];

            // Pick the correct directional sprite from South, West, North, East
            let quadrant = getQuadrant(sheep.direction);
            let [index, adjustedAngle] = this.getIndexAndAdjustedAngle(quadrant, sheep.direction);

            // Pick the correct sprite leg position based on the frame count
            if (!sheep.moving) {
                indexOffset = 2;
            } else {
                indexOffset = this.getSpriteFrame(this.frameCount);
            }
            let correctSprite = this.sprites.sheep.images[index + indexOffset];

            // Draw this sheep
            this.drawSprite(
                context,
                correctSprite,
                sheep.xPos,
                sheep.yPos,
                adjustedAngle
            )
            // Draw the sheep id
            context.fillText(sheep.id, sheep.xPos, sheep.yPos - 20);
        }

    }

    this.drawSprite = function (context, image, x, y, angle) {
        if (image) {
            context.save();
            context.translate(x, y);
            context.rotate(angle);
            context.drawImage(
                image,
                -image.width / 2, -image.height / 2,
                image.width, image.height);
            context.restore();
        }
    }

    /**
     * Takes the integer frameCount since the start of the game modulo 20, 
     * and chooses whether the left leg of the animal should be leading, the
     * right leg should be leading, or the two legs should be together.
     * 
     * This creates a walking effect by alternating the leg positions as
     * the frames progress.
     * 
     * @param {Integer} frameCount 
     * @returns 
     */
    this.getSpriteFrame = function (frameCount) {
        let modulus = frameCount % 20;
        if (modulus < 5) {
            return 0;
        } else if (modulus >= 10 && modulus < 15) {
            return 1;
        } else {
            return 2;
        }
    }

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
    this.getIndexAndAdjustedAngle = function (quadrant, direction) {
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
    }
}

export {
    GameRunner
}