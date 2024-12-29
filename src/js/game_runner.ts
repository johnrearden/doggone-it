import { Dog } from './dog';
import { Herd } from './herd';
import { levels } from '../data/levels';
import { drawFrame } from './frame_drawer';
import { FIELD_HEIGHT, FIELD_WIDTH, REPLAY_SNAPSHOT_FREQUENCY } from './constants';
import { ActionReplay, ReplaySpeed } from './action_replay';
import { show, hide, showMessage } from './utilities';
import { Sheep } from './sheep';
/**
 * This constructor function returns a GameRunner object, which is responsible
 * for creating and updating the main game objects - the dog and the herd of
 * sheep. It passes events from listeners attached to HTML elements in index.js
 * through to the objects that require them. It is also responsible for detecting
 * when the end of a level or the game is reached, and displaying the appropriate
 * message and options to the player.
 *
 * @param {Object} graphics
 * @param {Level} level
 */
export function GameRunner(
    graphics: any,
    level: Level): void {
    this.graphics = graphics;
    this.level = level;
    // The framecount variable can be used by the update method to increase the number
    // frames per update cycle, and thus slow down the game. As it is very useful
    // during development, I have left it in with a view to implementing further
    // features which is made easier by being able to do slow-motion visual
    // debugging
    this.frameCount = 0;
    this.running = false;
    this.dog = new Dog(FIELD_WIDTH / 2, FIELD_HEIGHT / 4, level.obstacles);
    this.herd = new Herd(level);
    this.awaitingGameStart = true;
    this.levelTimeLimit = level.time * 1000;
    this.timeRemaining = level.time * 1000;
    this.lastStartTime = new Date().getTime();
    this.actionReplay = null;
    // The snapshots array consists of a series of objects which record 
    // just the information necessary to draw the frame - i.e. the position
    // and direction of the dog and the sheep in the herd. These are 
    // replayed one by one to show an action replay of the level
    this.snapshots = [];
    show(["go-button"]);
    // This is the callback passed to window.requestAnimationFrame, 
    // and needs to be explicitly bound to the GameRunner object, 
    // otherwise 'this' will refer to the window object from the 
    // requestAnimationFrame() scope.
    this.updateGame = (function () {
        if (++this.frameCount % 1 === 0) {
            this.drawBackground();
            // If an action replay exists, update it.
            if (this.actionReplay) {
                this.actionReplay.update();
            }
            else if (this.running) {
                this.dog.update();
                this.herd.update(this.dog);
                let sheepRemainingDisplay = document.getElementById("sheep-remaining");
                if (sheepRemainingDisplay) {
                    sheepRemainingDisplay.innerText = this.herd.xArray.length;
                }
                // Check for level complete
                if (this.herd.allSheepGone) {
                    if (this.level.id + 1 === levels.length) {
                        // Player has finished the final level, and thus
                        // the game
                        this.running = false;
                        this.dimmerMaskOn(true);
                        hide(["next-level-button",
                            "go-button",
                            "try-again-button"]);
                        show([
                            "end-of-level-display",
                            "end-level-message",
                        ]);
                        showMessage("You beat the game!");
                    }
                    else {
                        // Player has finished just the current level
                        this.running = false;
                        this.dimmerMaskOn(true);
                        show([
                            "end-of-level-display",
                            "end-level-message",
                            "next-level-button",
                            "action-replay-button"
                        ]);
                        hide(["go-button",
                            "try-again-button"]);
                        showMessage(`LEVEL ${this.level.id + 1} COMPLETE!`);
                    }
                }
                // Update the time display
                let currentTime = new Date().getTime();
                let elapsedTime = currentTime - this.lastStartTime;
                let timerBar = document.getElementById("time-remaining") as HTMLInputElement;
                let value = Math.ceil(this.timeRemaining - elapsedTime);
                if (timerBar) {
                    timerBar.value = value.toString();
                }

                // Check if time has run out
                if (value <= 0) {
                    this.running = false;
                    this.dimmerMaskOn(true);
                    show(["end-of-level-display",
                        "end-level-message",
                        "action-replay-button",
                        "try-again-button"]);
                    hide(["next-level-button", "go-button"]);
                    showMessage("Out of time!");
                }
                // Take a snapshot of the game for action replays
                if (this.frameCount % REPLAY_SNAPSHOT_FREQUENCY === 0) {
                    let dog: DogData = {
                        x: this.dog.xPos,
                        y: this.dog.yPos,
                        direction: this.dog.direction
                    };

                    let snapshot: Snapshot = {
                        dog: dog,
                        sheep: []
                    };
                    let sheep: Sheep;
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
            }
            // Finally, if this is not an action replay, draw the frame
            if (!this.actionReplay) {
                drawFrame(this.dog, this.herd, this.frameCount, this.graphics);
            }
        }
        // Request the next frame, passing the updateGame function as the callback.
        window.requestAnimationFrame(this.updateGame);
    }).bind(this);
    this.onGoButtonClicked = function () {
        this.startGameAgain();
    };
    /**
     * Starts the current level again.
     */
    this.repeatCurrentLevel = function () {
        this.startLevel(this.level.id);
    };
    /**
     * Starts the next level.
     */
    this.startNextLevel = function () {
        this.startLevel(this.level.id + 1);
    };
    /**
     * Begins the game again at level 0 (shown to the player as 1)
     */
    this.startGameAgain = function () {
        this.awaitingGameStart = false;
        this.startLevel(0);
    };
    /**
     * Begin a level
     * @param {Integer} levelIndex
     */
    this.startLevel = function (levelIndex) {
        this.snapshots = [];
        hide(["end-of-level-display"]);
        this.level = levels[levelIndex];
        this.dog = new Dog(FIELD_WIDTH / 2, FIELD_HEIGHT / 2, this.level.obstacles);
        // A new dog is created for each level, so the listener for the 
        // dog speed slider in settings must be attached each time
        this.dog.setSliderEventListener();
        // As with the dog, a new herd is created for each level, and 
        // needs its own event listeners
        this.herd = new Herd(this.level);
        this.herd.setHerdClosenessEventListener();
        this.herd.setDogScarinessEventListener();
        this.frameCount = 0;
        let timeAllowedSlider = document.getElementById("time-allowed") as HTMLInputElement;
        if (timeAllowedSlider) {
            this.levelTimeLimit = this.level.time * 1000 * Number(timeAllowedSlider.value);
            this.timeRemaining = this.level.time * 1000 * Number(timeAllowedSlider.value);
        }

        // Calibrate the time remaining display to this level's time limit.
        let timeRemainingDisplay = document.getElementById("time-remaining") as HTMLInputElement;
        if (timeRemainingDisplay) {
            timeRemainingDisplay.max = this.levelTimeLimit.toString();
            timeRemainingDisplay.value = this.levelTimeLimit.toString();
        }
        this.lastStartTime = new Date().getTime();
        this.running = true;
    };
    // Clear the contents of the game canvas by drawing over it.
    this.drawBackground = function () {
        let image = this.graphics.backgrounds.images[this.level.id];
        if (image) {
            let gameCanvas = document.getElementById('game-area') as HTMLCanvasElement;
            let context = gameCanvas?.getContext('2d');
            if (gameCanvas && context) {
                context.drawImage(image, 0, 0);
            }

        }
    };
    /**
     * Allows the game to be restarted
     */
    this.start = function () {
        this.running = true;
        this.lastStartTime = new Date().getTime();
    };
    /**
     * Allows the game to be paused
     */
    this.stop = function () {
        this.running = false;
        let currentTime = new Date().getTime();
        let timeSinceLastStart = currentTime - this.lastStartTime;
        this.timeRemaining -= timeSinceLastStart;
    };
    /**
     * Begins an action replay of the level just finished
     */
    this.startActionReplay = function () {
        this.dimmerMaskOn(false);
        hide(["end-of-level-display"]);
        show(["action-replay-display",
            "replay-banner",
            "replay-time"]);
        this.actionReplay = new ActionReplay(this.snapshots, this.graphics, this.level);
    };
    /**
     * Ends the replay, and presents the player with the choice of
     * playing the same level again, or going to the next level if the
     * previous one was completed successfully
     */
    this.finishReplay = function () {
        this.actionReplay = null;
        hide(["action-replay-display",
            "end-level-message",
            "action-replay-button",
            "replay-time",
            "replay-banner"]);
        show(["end-of-level-display"]);
    };
    /**
     * Resets the action replay back to the first frame
     */
    this.toStart = function () {
        if (this.actionReplay) {
            this.actionReplay.snapshotIndex = 0;
        }
    };
    /**
     * Sets the speed of the action replay to -1x
     */
    this.rewindReplay = function () {
        if (this.actionReplay) {
            this.actionReplay.replaySpeed = ReplaySpeed.REWIND;
            show(["pause"]);
            hide(["play"]);
        }
    };
    /**
     * Starts the action replay, playing at 1x
     */
    this.playReplay = function () {
        if (this.actionReplay) {
            this.actionReplay.replaySpeed = ReplaySpeed.NORMAL;
            show(["pause"]);
            hide(["play"]);
        }
    };
    /**
     * Paused the action replay
     */
    this.pauseReplay = function () {
        if (this.actionReplay) {
            this.actionReplay.replaySpeed = ReplaySpeed.PAUSE;
            show(["play"]);
            hide(["pause"]);
        }
    };
    /**
     * Plays the action replay at double speed, 2x
     */
    this.fastForwardReplay = function () {
        if (this.actionReplay) {
            this.actionReplay.replaySpeed = ReplaySpeed.FAST_FORWARD;
            show(["pause"]);
            hide(["play"]);
        }
    };
    /**
     * Passes the pointer events through to the dog, as long as the game
     * is running, and not an action replay.
     * @param {Number} x The position of the pointer on the x-axis
     * @param {Number} y The position of the pointer on the y-axis
     */
    this.onPointerDown = function (x, y) {
        if (!this.actionReplay) {
            this.dog.onPointerDown(x, y);
        }
    };
    /**
     * Passes the pointer events through to the dog, as long as the game
     * is running, and not an action replay.
     * @param {Number} x The position of the pointer on the x-axis
     * @param {Number} y The position of the pointer on the y-axis
     */
    this.onPointerUp = function (x, y) {
        if (!this.actionReplay) {
            this.dog.onPointerUp(x, y);
        }
    };
    /**
     Passes the pointer events through to the dog, as long as the game
     * is running, and not an action replay.
     * @param {Number} x The position of the pointer on the x-axis
     * @param {Number} y The position of the pointer on the y-axis
     */
    this.onPointerMove = function (x, y) {
        if (!this.actionReplay) {
            this.dog.onPointerMove(x, y);
        }
    };
    /**
     * Utility method to partially mask the game ui while a choice of
     * buttons is being displayed to the player
     * @param {Boolean} bool Whether the mask should be on or off
     */
    this.dimmerMaskOn = function (bool: boolean) {
        let dimmerMask = document.getElementById("dimmer-mask");
        if (dimmerMask) {
            dimmerMask.style.opacity = bool ? "0.5" : "0";
        }
    };
}
