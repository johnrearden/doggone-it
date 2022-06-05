function GameRunner(sprites, dog) {
    this.sprites = sprites;
    this.dog = dog;
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
        let mod60 = this.frameCount % 20;
        if (!this.dog.moving) {
            correctSprite = this.sprites.dog.images[2];
        } else if (mod60 < 5) {
            correctSprite = this.sprites.dog.images[0];
        } else if (mod60 >= 10 && mod60 < 15) {
            correctSprite = this.sprites.dog.images[1];
        } else {
            correctSprite = this.sprites.dog.images[2];
        }
        // Draw the dog.
        this.drawSprite(
            context,
            correctSprite,
            Math.floor(this.dog.xPos),
            Math.floor(this.dog.yPos),
            this.dog.direction);

        // Draw the dog's destination
        context.fillStyle = 'red';
        context.fillRect(this.dog.xDest - 2, this.dog.yDest - 2, 5, 5);
    }

    this.drawSprite = function (context, image, x, y, angle) {
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

export {
    GameRunner
}