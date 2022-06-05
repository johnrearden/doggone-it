function GameRunner(sprites, dog) {
    this.sprites = sprites;
    this.dog = dog;
    console.log(dog);

    // This is the callback passed to window.requestAnimationFrame, 
    // and needs to be explicitly bound to the GameRunner object, 
    // otherwise 'this' will refer to the window object from the 
    // requestAnimationFrame() scope.
    this.updateGame = (function() {
        this.dog.update();
        this.drawFrame();
        console.log('Frame drawn');
    }).bind(this);

    this.drawFrame = function() {
        let gameCanvas = document.getElementById('game-area');
        let context = gameCanvas.getContext('2d');

        // Redraw an empty field.
        context.fillStyle = 'green';
        context.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

        // Draw the dog.
        this.drawSprite(
            context,
            this.sprites.dog.image,
            this.dog.xPos,
            this.dog.yPos,
            this.dog.direction);

        // Request the next frame, passing the gameloop function as the callback.
        //window.requestAnimationFrame(this.updateGame());
    }

    this.drawSprite = function(context, image, x, y, angle) {
        context.translate(x, y);
        context.rotate(angle);
        context.drawImage(
            image,
            x - image.width / 2, y - image.height / 2,
            image.width, image.height);
        context.restore();
    }
}

export {
    GameRunner
}