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

    // Calibrate the time remaining display to this level's time limit.
    document.getElementById("time-remaining").max = this.levelTimeLimit;
    document.getElementById("time-remaining").value = this.levelTimeLimit;


    // This is the callback passed to window.requestAnimationFrame, 
    // and needs to be explicitly bound to the GameRunner object, 
    // otherwise 'this' will refer to the window object from the 
    // requestAnimationFrame() scope.
    this.updateGame = (function () {
        if (++this.frameCount % 1 === 0) {
            // If an action replay exists, update it.
            if (this.actionReplay) {
                this.actionReplay.update();
            } else if (this.running) {
                this.drawBackground();
                this.dog.update();
                this.herd.update(this.dog);

                // Check for level complete
                if (this.herd.allSheepGone) {
                    if (this.level.id + 1 === levels.length) {
                        // Player has finished the final level
                        this.running = false;
                        this.dimmerMaskOn(true);
                        this.show(["end-of-level-display", 
                                   "game-complete-button",
                                   "end-level-message",
                                   "next-level"]);
                        this.hide(["level-over-button"]);
                        this.showMessage("You beat the game!");
                    } else {
                        this.running = false;
                        this.dimmerMaskOn(true);
                        this.show(["end-of-level-display", 
                                   "end-level-message",
                                   "next-level"]);
                        this.showMessage(`LEVEL ${this.level.id + 1} COMPLETE!`);
                    }
                }

                // Update the time display
                let currentTime = new Date().getTime();
                let elapsedTime = currentTime - this.lastStartTime;
                let timerBar = document.getElementById("time-remaining");
                let value = Math.ceil(this.timeRemaining - elapsedTime);
                timerBar.value = value;

                // Check if time has run out
                if (value <= 0) {
                    this.running = false;
                    this.dimmerMaskOn(true);
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

                // Finally, draw the frame
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

    /**
     * Starts the next level.
     */
    this.startNextLevel = function () {
        this.startLevel(this.level.id + 1);
    }

    /**
     * Begins the game again at level 0 (shown to the player as 1)
     */
    this.startGameAgain = function () {
        this.startLevel(0);
    }

    /**
     * Begin a level
     * @param {Integer} levelIndex 
     */
    this.startLevel = function (levelIndex) {
        this.snapshots = [];
        this.hide(["end-of-level-display"]);
        this.level = levels[levelIndex];
        this.dog = new Dog(FIELD_WIDTH / 2, 
                           FIELD_HEIGHT / 2,
                           this.level.obstacles);
        this.herd = new Herd(this.level);
        this.frameCount = 0;
        this.levelTimeLimit = this.level.time * 1000;
        this.timeRemaining = this.level.time * 1000;
        this.lastStartTime = new Date().getTime();

        this.running = true;
    }

    // Clear the contents of the game canvas by drawing over it.
    this.drawBackground = function () {
        if (background.image) {
            let gameCanvas = document.getElementById('game-area');
            let context = gameCanvas.getContext('2d');
            context.drawImage(this.background.image, 0, 0);
        }
    }

    /**
     * Allows the game to be restarted
     */
    this.start = function () {
        this.running = true;
        this.startTime = new Date().getTime();
    }

    /**
     * Allows the game to be paused
     */
    this.stop = function () {
        this.running = false;
        let currentTime = new Date().getTime();
        let timeSinceLastStart = currentTime - this.lastStartTime;
        this.timeRemaining -= timeSinceLastStart;
    }

    /**
     * Begins an action replay of the level just finished
     */
    this.startActionReplay = function () {
        this.dimmerMaskOn(false);
        this.hide(["end-of-level-display"]);
        this.show(["action-replay-display", 
                   "replay-banner", 
                   "replay-time"]);
        this.actionReplay = new ActionReplay(
                                    this.snapshots, 
                                    this.sprites, 
                                    this.background);
    }

    /**
     * Ends the replay, and presents the player with the choice of
     * playing the same level again, or going to the next level if the
     * previous one was completed successfully
     */
    this.finishReplay = function () {
        this.actionReplay = null;
        this.hide(["action-replay-display", 
                   "end-level-message", 
                   "action-replay",
                   "replay-time",
                   "replay-banner"]);
        this.show(["end-of-level-display"]);
    }

    /**
     * Sets the speed of the action replay to -1x
     */
    this.rewindReplay = function () {
        if (this.actionReplay) {
            this.actionReplay.replaySpeed = ReplaySpeed.REWIND;
        }
    }

    /**
     * Starts the action replay, playing at 1x
     */
    this.playReplay = function () {
        if (this.actionReplay) {
            this.actionReplay.replaySpeed = ReplaySpeed.NORMAL;
        }
    }

    /**
     * Paused the action replay
     */
    this.pauseReplay = function () {
        if (this.actionReplay) {
            this.actionReplay.replaySpeed = ReplaySpeed.PAUSE;
        }
    }

    /**
     * Plays the action replay at double speed, 2x
     */
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

    /**
     * Utility method to display an array of HTML elements.
     * @param {Array} array of HTML id attributes 
     */
    this.show = function (array) {
        for (let i = 0; i < array.length; i++) {
            document.getElementById(array[i]).style.display = "initial";
        }
    }

    /**
     * Utility method to display an array of HTML elements.
     * @param {Array} array of HTML id attributes 
     */
    this.hide = function (array) {
        for (let i = 0; i < array.length; i++) {
            document.getElementById(array[i]).style.display = "none";
        }
    }

    /**
     * Utility method to show a string to the player
     * @param {String} message to be displayed
     */
    this.showMessage = function(message) {
        let displayText = document.getElementById("end-level-message");
        displayText.innerText = message;
    }

    /**
     * Utility method to partially mask the game ui while a choice of 
     * buttons is being displayed to the player
     * @param {Boolean} bool Whether the mask should be on or off 
     */
    this.dimmerMaskOn = function(bool) {
        let dimmerMask = document.getElementById("dimmer-mask");
        dimmerMask.style.opacity = bool ? 0.4 : 0;
    }
}
