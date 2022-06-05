import {Dog} from './dog.js';

// Wait for all content to be loaded into the DOM before performing setup.
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded triggered');
    init();
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
        console.log(`click detected @ ${xDest},${yDest}`);
        dog.setDestination(xDest, yDest);
    });

    let sprites = {
        dog: {
            url: '../images/dog.png',
            image: null,
        },
        // sheep: {
        //     url: '../images/sheep.png',
        //     image: null
        // }
    };

    let gameRunner = new GameRunner(sprites, dog);

    loadAllImages([sprites.dog,]);

    window.requestAnimationFrame(gameRunner.updateGame);
}

async function loadAllImages(sprites) {
    const promiseArray = [];
    const imageArray = [];

    for (let sprite of sprites) {
        promiseArray.push(new Promise(resolve => {
            const img = new Image();
            img.onload = function() {
                
                // Here the image will be scaled if the canvas
                // size differs from the game model size

                resolve();
            }
            img.src = sprite.url;
            imageArray.push(img);
        }));
    }
    await Promise.all(promiseArray);
    console.log('images loaded');
    return imageArray;
}