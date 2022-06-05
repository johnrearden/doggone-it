// Wait for all content to be loaded into the DOM before performing setup.
document.addEventListener('DOMContentLoaded', function() {
    let gameCanvas = document.getElementById('game-area');
    gameCanvas.addEventListener('click', function(event) {

    });
})

function init() {
    
    let gameCanvas = document.getElementById('game-area');
    let context = gameCanvas.getContext('2d');
    let canvasWidth = context.width;
    let canvasHeight = context.height;

    let dog = new Dog(canvasWidth / 2, canvasHeight / 2);

    gameCanvas.addEventListener('click', function(event) {
        let rect = gameCanvas.getBoundingClientRect();
        let xDest = event.clientX - rect.left;
        let yDest = event.clientY - rect.top;
        dog.setDestination(xDest, yDest);
    });

    window.requestAnimationFrame(gameLoop);
}

function gameLoop() {
    dog.update();
    drawFrame();
}

function drawFrame() {
    let gameCanvas = document.getElementById('game-area');
    let context = gameCanvas.getContext('2d');

    // Redraw an empty field.
    context.fillColor = 'green';
    context.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Draw the dog.
    drawSprite(context, dogImage, dog.xPos, dog.yPos, dog.direction);
    

    window.requestAnimationFrame(gameLoop);
}

function drawSprite(context, image, x, y, angle) {
    context.translate(x, y);
    context.rotate(angle);
    context.drawImage(
        image, 
        x - image.width / 2, y - image.height / 2, 
        image.width, image.height);
    context.restore();
}

function loadAllImages(imageUrls) {

}