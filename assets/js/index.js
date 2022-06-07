import {
    Dog
} from './dog.js';

import {
    GameRunner
} from './game_runner.js';

import {
    Herd
} from './herd.js';

// Wait for all content to be loaded into the DOM before performing setup.
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM content loaded triggered');
    init();
})

function init() {
    let CANVAS_WIDTH = 400;
    let CANVAS_HEIGHT = 500;
    let gameCanvas = document.getElementById('game-area');
    gameCanvas.width = CANVAS_WIDTH;
    gameCanvas.height = CANVAS_HEIGHT;

    let dog = new Dog(gameCanvas.width / 2, gameCanvas.height / 2);
    let herd = new Herd(6, gameCanvas.width, gameCanvas.height);

    gameCanvas.addEventListener('click', function (event) {
        let rect = gameCanvas.getBoundingClientRect();

        // The mouse coordinates must be converted to the internal canvas 
        // coordinates.
        let xDest = (event.clientX - rect.left) / rect.width * CANVAS_WIDTH;
        let yDest = (event.clientY - rect.top) / rect.height * CANVAS_HEIGHT;
        dog.setDestination(xDest, yDest);
    });

    let sprites = {
        dog: {
            urls: [
                'dog_south_left', 'dog_south_right', 'dog_south_center',
                'dog_west_left', 'dog_west_right', 'dog_west_center',
                'dog_north_left', 'dog_north_right', 'dog_north_center',
                'dog_east_left', 'dog_east_right', 'dog_east_center'
            ],
            images: [],
        },
        sheep: {
            urls: [
                'sheep_south_left', 'sheep_south_right', 'sheep_south_center',
                'sheep_west_left', 'sheep_west_right', 'sheep_west_center',
                'sheep_north_left', 'sheep_north_right', 'sheep_north_center',
                'sheep_east_left', 'sheep_east_right', 'sheep_east_center'
            ],
            images: []
        }
    };

    let gameRunner = new GameRunner(sprites, dog, herd);

    loadAllImages(sprites);
    console.log(gameRunner);

    window.requestAnimationFrame(gameRunner.updateGame);
}

async function loadAllImages(sprites) {
    let promiseArray = [];

    // Load 12 dog images.
    for (let url of sprites.dog.urls) {
        promiseArray.push(new Promise(resolve => {
            const img = new Image();
            img.onload = function () {
                // Here the image will be scaled if the canvas
                // size differs from the game model size
                resolve();
            }
            img.src = `../assets/images/dog_images/${url}.png`;
            sprites.dog.images.push(img);
        }));
    }
    await Promise.all(promiseArray);
    console.log('dog images loaded');

    // Load 12 sheep images.
    promiseArray = [];
    for (let url of sprites.sheep.urls) {
        promiseArray.push(new Promise(resolve => {
            const img = new Image();
            img.onload = function () {
                // Here the image will be scaled if the canvas
                // size differs from the game model size
                resolve();
            }
            img.src = `../assets/images/sheep_images/${url}.png`;
            sprites.sheep.images.push(img);
        }));
    }
    await Promise.all(promiseArray);
    console.log('sheep images loaded');
}