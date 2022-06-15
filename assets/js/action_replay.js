import { REPLAY_SNAPSHOT_FREQUENCY } from "./constants.js";
import { Dog } from "./dog.js";
import { getQuadrant } from "./utilities.js";
import { getIndexAndAdjustedAngle, drawSprite } from "./frame_drawer.js";
import { Herd } from "./herd.js";

export const ReplaySpeed = {
    NORMAL: 1,
    PAUSE: 0,
    FAST_FORWARD: 2,
    REWIND: -1
}

export class ActionReplay {
    constructor(snapshots, sprites, background) {
        this.snapshots = snapshots;
        this.sprites = sprites;
        this.background = background;

        this.snapshotIndex = 0;
        this.frameCount = 0;
        this.replaySpeed = ReplaySpeed.NORMAL;

        this.drawBackground();
        this.drawReplayFrame(snapshots[0]);

        let replaySlider = document.getElementById("replay-slider");
        replaySlider.max = this.snapshots.length - 1;
    }

    update = function () {
        if (++this.frameCount % REPLAY_SNAPSHOT_FREQUENCY === 0) {
            
            this.snapshotIndex += this.replaySpeed;
            if (this.snapshotIndex < 0) {
                this.snapshotIndex = 0;
            } else if (this.snapshotIndex >= this.snapshots.length) {
                this.snapshotIndex = this.snapshots.length - 1;
            }
            document.getElementById("replay-speed").innerText = this.snapshotIndex;
            this.drawBackground();
            this.drawReplayFrame(this.snapshots[this.snapshotIndex]);

            let replaySlider = document.getElementById("replay-slider");
            replaySlider.value = this.snapshotIndex;

            
        }

        if (this.frameCount % 30 === 0) {
            let replayBanner = document.getElementById("replay-banner");
            if (replayBanner.style.display === "none") {
                replayBanner.style.display = "initial";
            } else {
                replayBanner.style.display = "none";
            }
        }

    }

    drawReplayFrame = function (snapshot) {

        let canvas = document.getElementById("game-area");
        if (canvas) {
            document.getElementById("sheep-remaining").innerText = snapshot.sheep.length;
            let context = canvas.getContext("2d");
            // Pick the correct directional sprite from South, West, North, East
            let quadrant = getQuadrant(snapshot.dog.direction);
            let [index, adjustedAngle] = getIndexAndAdjustedAngle(
                quadrant,
                snapshot.dog.direction);
            let correctSprite = this.sprites.dog.images[index];
            
            context.fillText("alsdkf;laksjdfa", 0, 0);
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
                let correctSprite = this.sprites.sheep.images[index];
                let scale = sheep.isLamb ? 0.7 : 1.0;

                // Draw this sheep
                drawSprite(
                    context,
                    correctSprite,
                    sheep.x,
                    sheep.y,
                    adjustedAngle,
                    scale
                )
            }
        }
    }

    drawSprite = function (context, image, x, y, angle, scale) {
        if (image) {
            let imgWidth = image.width * scale;
            let imgHeight = image.height * scale;
            context.save();
            context.translate(x, y);
            context.rotate(angle);
            context.drawImage(
                image,
                -imgWidth / 2, -imgHeight / 2,
                imgWidth, imgHeight);
            context.restore();
        }
    }

    drawBackground = function () {
        if (this.background.image) {
            let gameCanvas = document.getElementById('game-area');
            let context = gameCanvas.getContext('2d');
            context.drawImage(this.background.image, 0, 0);
        }
    }
}