import { Dog } from './dog.js';
import { Herd } from './herd.js';
import { levels } from '../data/levels.js';
import { drawFrame } from './frame_drawer.js';
import { FIELD_HEIGHT, FIELD_WIDTH, REPLAY_SNAPSHOT_FREQUENCY } from './constants.js';
import { ActionReplay, ReplaySpeed } from './action_replay.js';

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

    this.actionReplay = null;
    this.snapshots = [];

    document.getElementById("time-remaining").max = this.levelTimeLimit;
    document.getElementById("time-remaining").value = this.levelTimeLimit;

    // This is the callback passed to window.requestAnimationFrame, 
    // and needs to be explicitly bound to the GameRunner object, 
    // otherwise 'this' will refer to the window object from the 
    // requestAnimationFrame() scope.
    this.updateGame = (function () {
        if (++this.frameCount % 1 === 0) {
            if (this.actionReplay) {
                this.actionReplay.update();
            }

            if (this.running) {
                this.drawBackground();
                this.dog.update();
                this.herd.update(this.dog);

                // Check for level complete
                if (this.herd.allSheepGone) {
                    if (this.level.id + 1 === levels.length) {
                        this.running = false;
                        this.show(["end-of-level-display", 
                                   "game-complete-button",
                                   "end-level-message",
                                   "next-level"]);
                        this.hide(["level-over-button"]);
                        this.showMessage("You beat the game!");
                    } else {
                        this.running = false;
                        this.show(["end-of-level-display", "end-level-message"]);
                        this.showMessage(`LEVEL ${this.level.id + 1} COMPLETE!`);
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
                    this.show(["end-of-level-display", 
                               "action-replay"]);
                    this.hide(["next-level"]);
                    this.showMessage("Out of time!");
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
                            direction: sheep.direction,
                            isLamb: sheep.isLamb
                        });
                    }
                    this.snapshots.push(snapshot);
                }
                drawFrame(this.dog, this.herd, this.frameCount, this.sprites);
            }
            
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
        this.hide(["end-of-level-display"]);
        this.level = levels[levelIndex];
        this.dog = new Dog(FIELD_WIDTH / 2, FIELD_HEIGHT / 2);
        this.herd = new Herd(this.level.sheep);
        this.frameCount = 0;
        this.levelTimeLimit = this.level.time * 1000;
        this.timeRemaining = this.level.time * 1000;
        this.lastStartTime = new Date().getTime();

        this.running = true;
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

    this.startActionReplay = function () {
        console.log("starting action replay");
        this.hide(["end-of-level-display"]);
        this.show(["action-replay-display", 
                   "replay-banner", 
                   "replay-speed"]);
        this.actionReplay = new ActionReplay(
                                    this.snapshots, 
                                    this.sprites, 
                                    this.background);
    }

    this.finishReplay = function () {
        console.log("stopping action replay");
        this.actionReplay = null;
        this.hide(["action-replay-display", 
                   "end-level-message", 
                   "action-replay",
                   "replay-speed",
                   "replay-banner"]);
        this.show(["end-of-level-display"]);
    }

    this.rewindReplay = function () {
        if (this.actionReplay) {
            this.actionReplay.replaySpeed = ReplaySpeed.REWIND;
        }
    }


    this.playReplay = function () {
        if (this.actionReplay) {
            this.actionReplay.replaySpeed = ReplaySpeed.NORMAL;
        }
    }


    this.pauseReplay = function () {
        if (this.actionReplay) {
            this.actionReplay.replaySpeed = ReplaySpeed.PAUSE;
        }
    }


    this.fastForwardReplay = function () {
        if (this.actionReplay) {
            this.actionReplay.replaySpeed = ReplaySpeed.FAST_FORWARD;
        }
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

    this.show = function (array) {
        for (let i = 0; i < array.length; i++) {
            console.log(`showing ${array[i]}`);
            document.getElementById(array[i]).style.display = "initial";
        }
    }

    this.hide = function (array) {
        for (let i = 0; i < array.length; i++) {
            console.log(`hiding ${array[i]}`);
            document.getElementById(array[i]).style.display = "none";
        }
    }

    this.showMessage = function(message) {
        let displayText = document.getElementById("end-level-message");
        displayText.innerText = message;
    }
}
