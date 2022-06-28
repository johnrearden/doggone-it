import { REPLAY_SNAPSHOT_FREQUENCY } from "./constants.js";
import { getQuadrant, hide, show } from "./utilities.js";
import { getIndexAndAdjustedAngle, drawSprite } from "./frame_drawer.js";

/**
 * An enum representing the speed at which the replay is being played
 */
export const ReplaySpeed = {
    NORMAL: 1,
    PAUSE: 0,
    FAST_FORWARD: 2,
    REWIND: -2
};

/**
 * A class that represents an action replay of the level just played.
 */
export class ActionReplay {
    constructor(snapshots, graphics, level) {
        this.snapshots = snapshots;
        this.graphics = graphics;
        this.level = level;

        this.snapshotIndex = 0;
        this.frameCount = 0;
        this.replaySpeed = ReplaySpeed.FAST_FORWARD;

        this.drawBackground();
        this.drawReplayFrame(snapshots[0]);

        // Calibrate the replay slider's value scale.
        let replaySlider = document.getElementById("replay-slider");
        replaySlider.max = this.snapshots.length - 1;
    }

    update() {
        // Only update every REPLAY_SNAPSHOT_FREQUENCY frames
        if (++this.frameCount % REPLAY_SNAPSHOT_FREQUENCY === 0) {
            
            // Increment the index of the snapshot (which points to 
            // the correct snapshot in the array). Prevent it from running
            // off either end of the array
            this.snapshotIndex += this.replaySpeed;
            if (this.snapshotIndex <= 0) {
                this.snapshotIndex = 0;
                show(["play"]);
                hide(["pause"]);
                this.replaySpeed = ReplaySpeed.PAUSE;
            } else if (this.snapshotIndex >= this.snapshots.length) {
                this.snapshotIndex = this.snapshots.length - 1;
            }

            // Draw this snapshot
            this.drawBackground();
            this.drawReplayFrame(this.snapshots[this.snapshotIndex]);

            // Update the replay-time slider
            let replaySlider = document.getElementById("replay-slider");
            replaySlider.value = this.snapshotIndex;

            // Update the time-display.
            let timeDisplay = document.getElementById("replay-time");
            let framesPerSecond = 60 / REPLAY_SNAPSHOT_FREQUENCY;
            let seconds = this.snapshotIndex / framesPerSecond;
            let hundreths = (seconds % 1) * 100;
            let sText = Math.floor(seconds).toLocaleString("en-UK", {
                minimumIntegerDigits: 2
            });
            let hText = Math.floor(hundreths).toLocaleString("en-UK", {
                minimumIntegerDigits: 2
            });
            timeDisplay.innerText = `${sText}.${hText}`;
            
        }

        // Flash the replay banner on and off twice a second
        if (this.frameCount % 30 === 0) {
            let replayBanner = document.getElementById("replay-banner");
            if (replayBanner.style.display === "none") {
                replayBanner.style.display = "initial";
            } else {
                replayBanner.style.display = "none";
            }
        }

    }

    /**
     * Draws one snapshot frame of the previous level
     * @param {Snapshot} snapshot 
     */
    drawReplayFrame (snapshot) {

        let canvas = document.getElementById("game-area");
        if (canvas) {
            document.getElementById("sheep-remaining").innerText = snapshot.sheep.length;
            let context = canvas.getContext("2d");

            // Pick the correct directional sprite from South, West, North, East
            let quadrant = getQuadrant(snapshot.dog.direction);
            let [index, adjustedAngle] = getIndexAndAdjustedAngle(
                quadrant,
                snapshot.dog.direction);
            let correctSprite = this.graphics.dog.images[index];
            
            // Draw the dog.
            drawSprite(
                context,
                correctSprite,
                Math.floor(snapshot.dog.x),
                Math.floor(snapshot.dog.y),
                adjustedAngle,
                0.8);

            // Draw the herd
            for (let i = 0; i < snapshot.sheep.length; i++) {
                let sheep = snapshot.sheep[i];

                // Pick the correct directional sprite from South, West, North, East
                let quadrant = getQuadrant(sheep.direction);
                let [index, adjustedAngle] = getIndexAndAdjustedAngle(quadrant, sheep.direction);
                let correctSprite = this.graphics.sheep.images[index];
                let scale = sheep.isLamb ? 0.7 : 1.0;

                // Draw this sheep
                drawSprite(
                    context,
                    correctSprite,
                    sheep.x,
                    sheep.y,
                    adjustedAngle,
                    scale
                );
            }
        }
    }

    /**
     * Draws the background image onto the canvas in order to clear it
     */
    drawBackground() {
        let gameCanvas = document.getElementById('game-area');
            let context = gameCanvas.getContext('2d');
            context.drawImage(this.graphics.backgrounds.images[this.level.id], 0, 0);
        }
}