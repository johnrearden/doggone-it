import {Quadrant, getQuadrant} from './utilities.js';

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

        // Pick the correct dog sprite based on the frame count
        let correctSprite;

        // Pick the correct directional sprite from South, West, North, East
        let left, right, center, angle;
        let quadrant = getQuadrant(this.dog.direction);
        switch(quadrant) {
            case Quadrant.SOUTH: {
                left = 0; right = 1; center = 2;
                angle = this.dog.direction - Math.PI / 2;
                break;
            }
            case Quadrant.WEST: {
                left = 3; right = 4; center = 5;
                angle = 0;
                break;
            }
            case Quadrant.NORTH: {
                left = 6; right = 7; center = 8;
                angle = this.dog.direction + Math.PI / 2;
                break;
            }
            case Quadrant.EAST:
                angle = 0;
            default: {
                left = 9; right = 10; center = 11;
            }
        }

        let mod60 = this.frameCount % 20;
        if (!this.dog.moving) {
            correctSprite = this.sprites.dog.images[center];
        } else if (mod60 < 5) {
            correctSprite = this.sprites.dog.images[left];
        } else if (mod60 >= 10 && mod60 < 15) {
            correctSprite = this.sprites.dog.images[right];
        } else {
            correctSprite = this.sprites.dog.images[center];
        }
        // Draw the dog.
        this.drawSprite(
            context,
            correctSprite,
            Math.floor(this.dog.xPos),
            Math.floor(this.dog.yPos),
            angle);

        // Draw the dog's destination
        context.fillStyle = 'red';
        context.fillRect(this.dog.xDest - 2, this.dog.yDest - 2, 5, 5);

        // Draw the herd
        let correctSheepSprite = this.sprites.sheep.images[0];
        for (let i = 0; i < herd.xArray.length; i++) {
            this.drawSprite(
                context, 
                correctSheepSprite,
                herd.xArray[i].xPos,
                herd.xArray[i].yPos,
                herd.xArray[i].direction
            )
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
}

export {
    GameRunner
}