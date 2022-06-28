import {Dog} from './dog.js';
import {Herd} from './herd.js';
import {GameRunner} from './game_runner.js';
import { levels } from '../data/levels.js';
import { FIELD_HEIGHT, FIELD_WIDTH } from './constants.js';

// Wait for all content to be loaded into the DOM before performing setup.
document.addEventListener('DOMContentLoaded', function () {
    init();
});

/**
 * Executes the startup tasks - 
 *  1) Create a graphics object to hold the graphics urls and images
 *  2) Create the main game objects - gameRunner, dog and herd
 *  3) Add event listeners to the canvas for click and drag events
 *  4) Add event listeners to the end-of-level buttons
 *  5) Add event listeners to the action-replay control buttons
 *  6) Load the images asynchronously
 *  7) Call window.requestAnimationFrame() to begin drawing the game
 */
function init() {
    let gameCanvas = document.getElementById('game-area');
    gameCanvas.width = FIELD_WIDTH;
    gameCanvas.height = FIELD_HEIGHT;

    /* 
        The graphics used by the game consist of 2 characters (dog and sheep)
        and a unique background for each level. Each character has four possible 
        directions in which it can face, and three animation frames for each
        direction:
            1) left leg forward
            2) right leg forward
            3) legs together,
        making 12 sprites in total.
    */
    let graphics = {
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
        },
        backgrounds: {
            urls: ['level1', 'level2', 'level3'],
            images: [],
        }
    };


    // Create the main game objects
    let level = levels[0];
    // let dog = new Dog(FIELD_WIDTH / 2, 
    //                   FIELD_HEIGHT / 4,
    //                   level.obstacles);
    // let herd = new Herd(level);
    let gameRunner = new GameRunner(graphics, level);


    // Add event listeners to the game canvas, to enable the player to 
    // control the dog
    gameCanvas.addEventListener('pointerdown', (event) => {
        let rect = gameCanvas.getBoundingClientRect();
        let x = (event.clientX - rect.left) / rect.width * FIELD_WIDTH;
        let y = (event.clientY - rect.top) / rect.height * FIELD_HEIGHT;
        gameRunner.onPointerDown(x, y);
    });

    gameCanvas.addEventListener('pointerup', (event) => {
        let rect = gameCanvas.getBoundingClientRect();
        let x = (event.clientX - rect.left) / rect.width * FIELD_WIDTH;
        let y = (event.clientY - rect.top) / rect.height * FIELD_HEIGHT;
        gameRunner.onPointerUp(x, y);
    });

    gameCanvas.addEventListener('pointermove', event => {
        if (gameRunner.frameCount % 2 === 0){ // throttle the mouse events
            let rect = gameCanvas.getBoundingClientRect();
            let x = (event.clientX - rect.left) / rect.width * FIELD_WIDTH;
            let y = (event.clientY - rect.top) / rect.height * FIELD_HEIGHT;
            gameRunner.onPointerMove(x, y);
        }
    });

    //  Prevents a touch (mobile only) on the gameCanvas from scrolling
    //  the entire view
    gameCanvas.addEventListener('touchmove', event => {
        event.preventDefault();
    });


    // Add event listeners to the buttons displayed at the start of the game, 
    // and at the end of each level. The event listener is just added to the DOM
    // here, and the event handling is delegated to the gameRunner object
    document.getElementById("go-button").addEventListener('click', event => {
        gameRunner.dimmerMaskOn(false);
        gameRunner.onGoButtonClicked();
    });

    // There are two different buttons to launch the instructions - one at the
    // top of the screen and one in the end-of-level display, only shown 
    // between levels
    let array = document.getElementsByClassName("instructions-button");
    for (let button of array) {
        button.addEventListener('click', () => {
            document.getElementById("instructions-modal").style.display = "initial";
            gameRunner.stop();
        });
    }
    
    document.getElementById("close-instructions-button").addEventListener('click', () => {
        document.getElementsByClassName("modal")[0].style.display = "none";   
        if (!gameRunner.awaitingGameStart) {
            gameRunner.start();     
        }
    });

    document.getElementById("settings-top-button").addEventListener('click', () => {
        document.getElementById("settings-modal").style.display = "initial";
        gameRunner.stop();
    });

    document.getElementById("close-settings-button").addEventListener('click', () => {
        document.getElementById("settings-modal").style.display = "none";
        if (!gameRunner.awaitingGameStart) {
            gameRunner.start();     
        }
    });

    document.getElementById("next-level-button").addEventListener('click', event => {
        gameRunner.dimmerMaskOn(false);
        gameRunner.startNextLevel();
    });

    document.getElementById("try-again-button").addEventListener('click', event => {
        gameRunner.dimmerMaskOn(false);
        gameRunner.repeatCurrentLevel();
    });

    document.getElementById("action-replay-button").addEventListener('click', event => {
        gameRunner.dimmerMaskOn(false);
        gameRunner.startActionReplay();
    });

    document.getElementById("begin-again-button").addEventListener('click', event => {
        gameRunner.dimmerMaskOn(false);
        gameRunner.startGameAgain();
    });


    // Add event listeners to the buttons used to control the action replay. Event
    // handling here is delegated to the gameRunner object
    document.getElementById("to-start").addEventListener('click', event => {
        gameRunner.toStart();
    });

    document.getElementById("rewind").addEventListener('click', event => {
        gameRunner.rewindReplay();
    });

    document.getElementById("play").addEventListener('click', event => {
        gameRunner.playReplay();
    });

    document.getElementById("pause").addEventListener('click', event => {
        gameRunner.pauseReplay();
    });

    document.getElementById("fast-forward").addEventListener('click', event => {
        gameRunner.fastForwardReplay();
    });

    document.getElementById("finish").addEventListener('click', event => {
        gameRunner.finishReplay();
    });

    // Finally, call the async function loadAllImages, and when the images
    // have all loaded successfully, make the first call to request an 
    // animation frame and begin the game drawing loop.
    loadAllImages(graphics).then(() => {
        window.requestAnimationFrame(gameRunner.updateGame);
    });
}

// This async function creates a Promise per image, and adds it to an array.
// Promise.all() is invoked to await resolution of all the promises
async function loadAllImages(graphics) {
    let promiseArray = [];

    // Create promises for loading of sheep images
    for (let url of graphics.dog.urls) {
        promiseArray.push(new Promise(resolve => {
            const img = new Image();
            img.src = `assets/images/dog_images/${url}.png`;
            graphics.dog.images.push(img);
            img.addEventListener('load', () => {
                resolve();
            });
        }));
    }

    // Create promises for loading of sheep images
    for (let url of graphics.sheep.urls) {
        promiseArray.push(new Promise(resolve => {
            const img = new Image();
            img.src = `assets/images/sheep_images/${url}.png`;
            graphics.sheep.images.push(img);
            img.addEventListener('load', () => {
                resolve();
            });
        }));
    }

    // Create promises for loading of level background images
    for (let url of graphics.backgrounds.urls) {
        promiseArray.push(new Promise(resolve => {
            const img = new Image();
            img.src = `assets/images/backgrounds/${url}.png`;
            graphics.backgrounds.images.push(img);
            img.addEventListener('load', () => {
                resolve();
            });
        }));
    }

    // Wait for all promises to resolve
    await Promise.all(promiseArray);
}