import {Dog} from './dog.js';
import {GameRunner} from './game_runner.js';

// Wait for all content to be loaded into the DOM before performing setup.
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded triggered');
    init();
})

function init() {
    let CANVAS_WIDTH = 400;
    let CANVAS_HEIGHT = 500;
    let gameCanvas = document.getElementById('game-area');
    gameCanvas.width = CANVAS_WIDTH;
    gameCanvas.height= CANVAS_HEIGHT;

    let dog = new Dog(gameCanvas.width / 2, gameCanvas.height / 2);

    gameCanvas.addEventListener('click', function(event) {
        let rect = gameCanvas.getBoundingClientRect();

        // The mouse coordinates must be converted to the internal canvas 
        // coordinates.
        let xDest = (event.clientX - rect.left) / rect.width * CANVAS_WIDTH;
        let yDest = (event.clientY - rect.top) / rect.height * CANVAS_HEIGHT;
        console.log(`click detected @ ${xDest},${yDest}`);
        dog.setDestination(xDest, yDest);
    });

    let sprites = {
        dog: {
            urls: ['../../assets/images/dog_right.png',
                   '../../assets/images/dog_left.png',
                   '../../assets/images/dog_center.png'
                ],
            images: null,
        },
        // sheep: {
        //     url: '../images/sheep.png',
        //     image: null
        // }
    };

    let gameRunner = new GameRunner(sprites, dog);

    loadAllImages([sprites.dog,]);
    console.log(gameRunner);
    
    window.requestAnimationFrame(gameRunner.updateGame);
}

async function loadAllImages(sprites) {
    const promiseArray = [];

    for (let sprite of sprites) {
        sprite.images = [];
        for (let url of sprite.urls) {
            promiseArray.push(new Promise(resolve => {
                const img = new Image();
                img.onload = function() {
                    
                    // Here the image will be scaled if the canvas
                    // size differs from the game model size
    
                    resolve();
                }
                img.src = url;
                sprite.images.push(img);
            }));
        }
        
    }
    await Promise.all(promiseArray);
    console.log('images loaded');
}