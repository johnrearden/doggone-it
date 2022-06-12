import { getQuadrant, Quadrant } from './utilities.js';

export function GameRunner(sprites, background, dog, herd, level) {
    this.sprites = sprites;
    this.background = background;
    this.dog = dog;
    this.herd = herd;
    this.frameCount = 0;
    this.running = true;
    this.levelTimeLimit = level.time * 1000;
    this.timeRemaining = level.time * 1000;
    this.lastStartTime = new Date().getTime();

    document.getElementById("time-remaining").max = this.levelTimeLimit;
    document.getElementById("time-remaining").value = this.levelTimeLimit;

    // This is the callback passed to window.requestAnimationFrame, 
    // and needs to be explicitly bound to the GameRunner object, 
    // otherwise 'this' will refer to the window object from the 
    // requestAnimationFrame() scope.
    this.updateGame = (function () {
        if (++this.frameCount % 1 === 0) {
            this.drawBackground();
            if (this.running) {
                this.dog.update();
                this.herd.update(dog);
                
                let currentTime = new Date().getTime();
                let elapsedTime = currentTime - this.lastStartTime;
                
                let timerBar = document.getElementById("time-remaining");
                let value = Math.ceil(this.timeRemaining - elapsedTime);
                timerBar.value = value;
            }
            this.drawFrame();
        }

        // Request the next frame, passing the updageGame function as the callback.
        window.requestAnimationFrame(this.updateGame);
    }).bind(this);

    this.drawBackground = function() {
        if (background.image) {
            let gameCanvas = document.getElementById('game-area');
            let context = gameCanvas.getContext('2d');
            context.drawImage(this.background.image, 0, 0);
        }
    }

    this.drawFrame = function () {
        let gameCanvas = document.getElementById('game-area');
        let context = gameCanvas.getContext('2d');

        // Draw the dog's path
        context.fillStyle = 'purple'
        if (this.dog.wayPoints.length > 0 && this.dog.pointerDown) {
            context.beginPath();
            context.moveTo(this.dog.xPos, this.dog.yPos);
            for (let i = 0; i < this.dog.wayPoints.length; i++) {
                context.lineTo(
                    this.dog.wayPoints[i][0],
                    this.dog.wayPoints[i][1]);
            }
            context.stroke();
        }

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
            adjustedAngle,
            0.65);

        // Draw the dog's destination
        context.fillStyle = dog.pointerDown ? 'red' : 'blue';
        context.fillRect(this.dog.xDest - 2, this.dog.yDest - 2, 5, 5);

        // Draw the herd center
        context.fillStyle = 'white';
        context.fillRect(this.herd.centerX, this.herd.centerY, 10, 10);

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
            
            // Every second sheep is a lamb.
            let scale = sheep.id % 2 === 0 ? 0.8 : 0.4;

            // Draw this sheep
            this.drawSprite(
                context,
                correctSprite,
                sheep.xPos,
                sheep.yPos,
                adjustedAngle,
                scale
            )
            // Draw the sheep id
            context.fillText(sheep.id, sheep.xPos, sheep.yPos - 20);
        }
    }

    this.drawSprite = function (context, image, x, y, angle, scale) {
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

    this.start = function() {
        this.running = true;
        this.startTime = new Date().getTime();
    }

    this.stop = function() {
        this.running = false;
        let currentTime = new Date().getTime();
        let timeSinceLastStart = currentTime - this.lastStartTime;
        this.timeRemaining -= timeSinceLastStart;
    }
}
