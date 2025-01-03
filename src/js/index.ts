import { GameRunner } from './game_runner';
import { levels } from '../data/levels';
import { FIELD_HEIGHT, FIELD_WIDTH } from './constants';


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
    let gameCanvas = document.getElementById('game-area') as HTMLCanvasElement;
    if (gameCanvas) {
        gameCanvas.width = FIELD_WIDTH;
        gameCanvas.height = FIELD_HEIGHT;
    }
    
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
    let gameRunner = new GameRunner(graphics, level);
    // Add event listeners to the game canvas, to enable the player to 
    // control the dog. 
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
        if (gameRunner.frameCount % 2 === 0) { // throttle the mouse events
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
    let goButton = document.getElementById("go-button") as HTMLButtonElement;
    goButton.addEventListener('click', event => {
        gameRunner.dimmerMaskOn(false);
        gameRunner.onGoButtonClicked();
    });
    
    // There are two different buttons to launch the instructions - one at the
    // top of the screen and one in the end-of-level display, only shown 
    // between levels
    let instructionsButton = document.querySelector("instructions-button");
    let instructionsModal = document.getElementById("instructions-modal");
        if (instructionsModal && instructionsButton) {
            instructionsButton.addEventListener('click', () => {
                instructionsModal.style.display = "initial";
                gameRunner.stop();
        });
    }

    // Add a listener to the close button on the instructions modal
    let closeButton = document.getElementById("close-instructions-button");
    if (closeButton && instructionsModal) {
        closeButton.addEventListener('click', () => {
            instructionsModal.style.display = "none";
            if (!gameRunner.awaitingGameStart) {
                gameRunner.start();
            }
        });
    }
    
    // Add a listener to the settings button to show the settings modal
    let settingsButton = document.getElementById("settings-top-button");
    if (settingsButton) {
        settingsButton.addEventListener('click', () => {
            let settingsModal = document.getElementById("settings-modal");
            if (settingsModal) {
                settingsModal.style.display = "initial";
                gameRunner.stop();
            }
        });
    }
    
    // Add a listener to the close button on the settings modal
    let closeSettingsButton = document.getElementById("close-settings-button");
    if (closeSettingsButton) {
        closeSettingsButton.addEventListener('click', () => {
            let settingsModal = document.getElementById("settings-modal");
            if (settingsModal) {
                settingsModal.style.display = "none";
                if (!gameRunner.awaitingGameStart) {
                    gameRunner.start();
                }
            }
        });
    }
    

    // Add listeners to the end-of-level-display buttons
    let nextLevelButton = document.getElementById("next-level-button");
    if (nextLevelButton) {
        nextLevelButton.addEventListener('click', () => {
            gameRunner.dimmerMaskOn(false);
            gameRunner.startNextLevel();
        });
    }
    
    // Add listeners to the end-of-level-display buttons
    let tryAgainButton = document.getElementById("try-again-button");
    if (tryAgainButton) {
        tryAgainButton.addEventListener('click', () => {
            gameRunner.dimmerMaskOn(false);
            gameRunner.repeatCurrentLevel();
        });
    }

    let actionReplayButton = document.getElementById("action-replay-button");
    if (actionReplayButton) {
        actionReplayButton.addEventListener('click', () => {
            gameRunner.dimmerMaskOn(false);
            gameRunner.startActionReplay();
        });
    }

    let beginAgainButton = document.getElementById("begin-again-button");
    if (beginAgainButton) {
        beginAgainButton.addEventListener('click', () => {
            gameRunner.dimmerMaskOn(false);
            gameRunner.startGameAgain();
        });
    }
    
    // Add event listeners to the buttons used to control the action replay. Event
    // handling here is delegated to the gameRunner object
    let toStartButton = document.getElementById("to-start");
    if (toStartButton) {
        toStartButton.addEventListener('click', () => {
            gameRunner.toStart();
        });
    }
    
    let rewindButton = document.getElementById("rewind");
    if (rewindButton) {
        rewindButton.addEventListener('click', () => {
            gameRunner.rewindReplay();
        });
    }
    
    let playButton = document.getElementById("play");
    if (playButton) {
        playButton.addEventListener('click', () => {
            gameRunner.playReplay();
        });
    }
    
    let pauseButton = document.getElementById("pause");
    if (pauseButton) {
        pauseButton.addEventListener('click', () => {
            gameRunner.pauseReplay();
        });
    }
    
    let fastForwardButton = document.getElementById("fast-forward");
    if (fastForwardButton) {
        fastForwardButton.addEventListener('click', () => {
            gameRunner.fastForwardReplay();
        });
    }
    
    let finishButton = document.getElementById("finish");
    if (finishButton) {
        finishButton.addEventListener('click', () => {
            gameRunner.finishReplay();
        });
    }
    
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
    let promiseArray: Promise<void>[] = [];
    // Create promises for loading of dog images
    for (let url of graphics.dog.urls) {
        promiseArray.push(new Promise<void>(resolve => {
            const img = new Image();
            img.src = `src/images/dog_images/${url}.png`;
            graphics.dog.images.push(img);
            img.addEventListener('load', () => {
                resolve();
            });
        }));
    }
    // Create promises for loading of sheep images
    for (let url of graphics.sheep.urls) {
        promiseArray.push(new Promise<void>(resolve => {
            const img = new Image();
            img.src = `src/images/sheep_images/${url}.png`;
            graphics.sheep.images.push(img);
            img.addEventListener('load', () => {
                resolve();
            });
        }));
    }
    // Create promises for loading of level background images
    for (let url of graphics.backgrounds.urls) {
        promiseArray.push(new Promise<void>(resolve => {
            const img = new Image();
            img.src = `src/images/backgrounds/${url}.png`;
            graphics.backgrounds.images.push(img);
            img.addEventListener('load', () => {
                resolve();
            });
        }));
    }
    // Wait for all promises to resolve
    await Promise.all(promiseArray);
}
