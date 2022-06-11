import {Dog} from './dog.js';
import {Herd} from './herd.js';
import {GameRunner} from './game_runner.js';

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
    let herd = new Herd(10, gameCanvas.width, gameCanvas.height);

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
    let background = {
        url: 'assets/images/backgrounds/1.png',
        image: null
    }

    let gameRunner = new GameRunner(sprites, background, dog, herd);

    loadAllImages(sprites, background);

    gameCanvas.addEventListener('mousedown', (event) => {
        let rect = gameCanvas.getBoundingClientRect();
        let x = (event.clientX - rect.left) / rect.width * CANVAS_WIDTH;
        let y = (event.clientY - rect.top) / rect.height * CANVAS_HEIGHT;
        dog.onPointerDown(x, y);
    });

    gameCanvas.addEventListener('mouseup', (event) => {
        let rect = gameCanvas.getBoundingClientRect();
        let x = (event.clientX - rect.left) / rect.width * CANVAS_WIDTH;
        let y = (event.clientY - rect.top) / rect.height * CANVAS_HEIGHT;
        dog.onPointerUp(x, y);
    });

    gameCanvas.addEventListener('mousemove', event => {
        if (gameRunner.frameCount % 5 === 0){ // throttle the mouse events
            let rect = gameCanvas.getBoundingClientRect();
            let x = (event.clientX - rect.left) / rect.width * CANVAS_WIDTH;
            let y = (event.clientY - rect.top) / rect.height * CANVAS_HEIGHT;
            dog.onPointerMove(x, y);
            document.getElementById("text-output").innerHTML = `pointer:${dog.pointerDown}, ${dog.wayPoints}`;
        }
    });

    window.requestAnimationFrame(gameRunner.updateGame);
}

async function loadAllImages(sprites, background) {
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
            img.src = `assets/images/dog_images/${url}.png`;
            sprites.dog.images.push(img);
            console.log(img.src);
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
            img.src = `assets/images/sheep_images/${url}.png`;
            sprites.sheep.images.push(img);
        }));
    }
    await Promise.all(promiseArray);
    console.log('sheep images loaded');

    // Load background image.
    background.image = new Image();
    background.image.src = background.url;
}