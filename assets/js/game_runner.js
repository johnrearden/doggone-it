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

        // Draw the dog.
        this.drawSprite(
            context,
            this.sprites.dog.image,
            Math.floor(this.dog.xPos),
            Math.floor(this.dog.yPos),
            this.dog.direction);
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