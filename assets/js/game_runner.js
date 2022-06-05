class GameRunner {
    constructor(sprites, dog) {
        this.sprites = sprites;
        this.dog = dog;
    }

    updateGame() {
        dog.update();
        drawFrame();
        console.log('Frame drawn');
    }

    drawFrame() {
        let gameCanvas = document.getElementById('game-area');
        let context = gameCanvas.getContext('2d');
    
        // Redraw an empty field.
        context.fillColor = 'green';
        context.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    
        // Draw the dog.
        drawSprite(context, dogImage, dog.xPos, dog.yPos, dog.direction);
        
        // Request the next frame, passing the gameloop function as the callback.
        window.requestAnimationFrame(gameLoop);
    }

    drawSprite(context, image, x, y, angle) {
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