import "./style.css";
import Game from "./model/Game.js";

// Create a canvas
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const game = new Game(canvas, ctx);

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draws the subject
    game.startState();
    // Draws invaders and missiles
    if (game.gameStarts) {
        game.createInvaderList();
        game.draw();
    }
    // Update the Scores
    game.update();
    window.requestAnimationFrame(draw);
}

draw();