import "./style.css";
import Game from "./model/Game.js";

// Create a canvas
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const game = new Game(canvas, ctx);

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draws the subject and invaders
    game.startState();
    game.createInvaderList();
    game.draw();

    // Update the game state
    game.update();

    // Request the next animation frame to keep the loop going
    requestAnimationFrame(draw);
}

draw();
