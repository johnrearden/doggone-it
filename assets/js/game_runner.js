import { Dog } from './dog.js';
import { Herd } from './herd.js';
import { levels } from '../data/levels.js';
import { drawFrame } from './frame_drawer.js';
import { FIELD_HEIGHT, FIELD_WIDTH, REPLAY_SNAPSHOT_FREQUENCY } from './constants.js';

export function GameRunner(sprites, background, dog, herd, level) {
    this.sprites = sprites;
    this.level = level;
    this.background = background;
    this.dog = dog;
    this.herd = herd;
    this.frameCount = 0;
    this.running = true;
    this.levelTimeLimit = level.time * 1000;
    this.timeRemaining = level.time * 1000;
    this.lastStartTime = new Date().getTime();

    this.snapshots = [];

    document.getElementById("time-remaining").max = this.levelTimeLimit;
    document.getElementById("time-remaining").value = this.levelTimeLimit;

    // This is the callback passed to window.requestAnimationFrame, 
    // and needs to be explicitly bound to the GameRunner object, 
    // otherwise 'this' will refer to the window object from the 
    // requestAnimationFrame() scope.
    this.updateGame = (function () {
        if (++this.frameCount % 1 === 0) {
            this.drawBackground();

            if (this.running) {
                this.dog.update();
                this.herd.update(this.dog);

                // Check for level complete
                if (this.herd.allSheepGone) {
                    if (this.level.id + 1 === levels.length) {
                        console.log("GAME COMPLETE!");
                        this.running = false;
                        let display = document.getElementById("end-of-level-display");
                        display.style.display = "initial";
                        let endGameDisplay = document.getElementById("game-complete-button");
                        endGameDisplay.style.display = "initial";
                        let displayText = document.getElementById("end-level-message");
                        displayText.innerText = `You beat the game!`;
                        let levelOverButtons = document.getElementById("level-over-buttons");
                        levelOverButtons.style.display = "none";
                    } else {
                        this.running = false;
                        let display = document.getElementById("end-of-level-display");
                        display.style.display = "initial";
                        let displayText = document.getElementById("end-level-message");
                        displayText.innerText = `LEVEL ${this.level.id + 1} COMPLETE!`;
                    }

                }

                let currentTime = new Date().getTime();
                let elapsedTime = currentTime - this.lastStartTime;

                let timerBar = document.getElementById("time-remaining");
                let value = Math.ceil(this.timeRemaining - elapsedTime);
                timerBar.value = value;

                // Check for out of time.
                if (value <= 0) {
                    this.running = false;
                    console.log("time up");
                    let display = document.getElementById("end-of-level-display");
                    display.style.display = "initial";
                    let displayText = document.getElementById("end-level-message");
                    displayText.innerText = `OUTTA TIME!`;
                    let nextLevelButton = document.getElementById("next-level");
                    nextLevelButton.style.display = "none";
                }

                // Take a snapshot of the game for action replays
                if (this.frameCount % REPLAY_SNAPSHOT_FREQUENCY === 0) {
                    let snapshot = {
                        dog: {
                            x: this.dog.xPos,
                            y: this.dog.yPos,
                            direction: this.dog.direction
                        },
                        sheep: []
                    }
                    let sheep;
                    for (let i = 0; i < this.herd.xArray.length; i++) {
                        sheep = this.herd.xArray[i];
                        snapshot.sheep.push({
                            x: sheep.xPos,
                            y: sheep.yPos,
                            direction: sheep.direction
                        });
                    }
                    this.snapshots.push(snapshot);
                }
            }
            drawFrame(this.dog, this.herd, this.frameCount, this.sprites);
        }

        // Request the next frame, passing the updageGame function as the callback.
        window.requestAnimationFrame(this.updateGame);
    }).bind(this);

    /**
     * Starts the current level again. 
     */
    this.repeatCurrentLevel = function () {
        this.startLevel(this.level.id);
    }

    this.startNextLevel = function () {
        this.startLevel(this.level.id + 1);
    }

    this.startGameAgain = function () {
        this.startLevel(0);
    }

    this.startLevel = function (levelIndex) {
        this.hideEndLevelDisplay();
        this.level = levels[levelIndex];
        this.dog = new Dog(FIELD_WIDTH / 2, FIELD_HEIGHT / 2);
        this.herd = new Herd(this.level.sheep);
        this.frameCount = 0;
        this.levelTimeLimit = level.time * 1000;
        this.timeRemaining = level.time * 1000;
        this.lastStartTime = new Date().getTime();

        this.running = true;
    }

    this.hideEndLevelDisplay = function () {
        let display = document.getElementById("end-of-level-display");
        display.style.display = "none";
    }

    this.drawBackground = function () {
        if (background.image) {
            let gameCanvas = document.getElementById('game-area');
            let context = gameCanvas.getContext('2d');
            context.drawImage(this.background.image, 0, 0);
        }
    }

    this.start = function () {
        this.running = true;
        this.startTime = new Date().getTime();
    }

    this.stop = function () {
        this.running = false;
        let currentTime = new Date().getTime();
        let timeSinceLastStart = currentTime - this.lastStartTime;
        this.timeRemaining -= timeSinceLastStart;
    }

    /**
     * Passes the pointer events through to the dog.
     * @param {Number} x The position of the pointer on the x-axis
     * @param {Number} y The position of the pointer on the y-axis
     */
    this.onPointerDown = function (x, y) {
        this.dog.onPointerDown(x, y);
    }

    /**
     * Passes the pointer events through to the dog.
     * @param {Number} x The position of the pointer on the x-axis
     * @param {Number} y The position of the pointer on the y-axis
     */
    this.onPointerUp = function (x, y) {
        this.dog.onPointerUp(x, y);
    }

    /**
     Passes the pointer events through to the dog.
     * @param {Number} x The position of the pointer on the x-axis
     * @param {Number} y The position of the pointer on the y-axis
     */
    this.onPointerMove = function (x, y) {
        this.dog.onPointerMove(x, y);
    }
}
