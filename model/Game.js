import Invader from "./Invader.js";
import Subject from "./Subject.js";
import Missile from "./Missile.js";


// List of sounds for the game
const backgroundMusic = new Audio("./assets/bg_music.mp3");
const shoot = new Audio("./assets/chime.mp3");
const explosion = new Audio("./assets/explosion.wav");
const punch = new Audio("./assets/punch.wav");

// List of items 
const arrow = "./assets/arrow.png";
const ripple = "./assets/ripple.png";
let currentItem = ripple;



class Game {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;

        // Create a face
        this.subject = new Subject(
            "./assets/face2.png",
            canvas.width / 2 - 25,
            canvas.height - 60,
            50,
            50
        );

        // Boolean values
        this.gameStarts = false;
        this.gameIsOver = false;
        // Boolean value to check if the invaders should start appearing
        this.invadersShouldStart = false;

        // Start a timer to set invadersShouldStart to true after 10 seconds
        setTimeout(() => {
            this.invadersShouldStart = true;
            this.createInvaderList(); // Create an initial invader after 10 seconds
        }, 2000); // 15000 milliseconds = 15 seconds
            

        // Create a missiles array
        this.missiles = [];
        this.numMissiles = 10;
        document.addEventListener("keydown", this.keyDownHandler.bind(this));

        // Create an invaders array
        this.invaders = [];
        this.numDeadInvaders = 0;
        this.numHeartBreaks = 0;
    }

    keyDownHandler(e) {
        // Each space bar press creates a missile
        if (e.key === " ") {
            if (this.numMissiles > 0) {
                if (currentItem === ripple) {
                    let missile = new Missile(
                        currentItem,
                        this.subject.x + 10 ,
                        this.subject.y - 20,
                        30,
                        45
                    );
                    this.missiles.push(missile);
                    shoot.play();
                    this.numMissiles--;
                } else {
                    let missile = new Missile(
                        currentItem,
                        this.subject.x + 10 ,
                        this.subject.y,
                        10,
                        35
                    );
                    this.missiles.push(missile);
                    shoot.play();
                    this.numMissiles--;
                }
            }
        }
        // Item changes
        if (e.key === "Up" || e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "Down") {
            if (currentItem === ripple)  {
                currentItem = arrow;
            } else {
                currentItem = ripple;
            }
            }
        
        if (e.key === "Right" || e.key === "ArrowRight" | e.key === "Left" || e.key === "ArrowLeft") {
            this.gameStarts = true;
        }
        if (this.gameStarts && backgroundMusic.currentTime <= 0) {
            backgroundMusic.play();
            backgroundMusic.loop = true;
        }
    }

    // Draws a subject in the middle of the screen
    startState() {
        this.subject.draw(this.ctx);
        this.subject.move(this.canvas.width);
    }

    // Create an Invader array
    createInvaderList() {
        if (!this.invadersShouldStart) {
            return; // Don't create invaders until the timer is up
        }

        // Adjust the maximum number of invaders you want to appear on the screen
        const maxInvaders = 5;
        const currentInvaders = this.invaders.length;
        if (currentInvaders >= maxInvaders) {
            return; // Limit the number of invaders on the screen
        }

        const rand = Math.random();
        // Adjust these probabilities as needed to control the appearance frequency
        if (rand < 0.001) { // 0.01% chance of heart
            this.invaders.push(new Invader(
                "./assets/heart.png",
                (this.canvas.width - 10) * Math.random(),
                this.canvas.height - 600,
                42,
                42,
                Math.floor(Math.random(),
                false)
            ));
        } else if (rand < 0.006) { // 1% chance of broken heart
            this.invaders.push(new Invader(
                "./assets/broken-heart.png",
                (this.canvas.width - 10) * Math.random(),
                this.canvas.height - 600,
                42,
                42,
                Math.floor(Math.random(),
                false)
            ));
        }
    }

    draw() {
        if (!this.gameIsOver) {
            // draws the invaders
            for (let i = 0; i < this.invaders.length; i++) {
                if (!this.invaders[i].isHit) {
                    this.invaders[i].draw(this.ctx);
                    this.invaders[i].move(this.canvas.width);
                }
            }
    
            // draws the missiles
            for (let j = 0; j < this.missiles.length; j++) {
                this.missiles[j].draw(this.ctx);
                this.missiles[j].move();
            }
    
            // Draw the item change message
            this.ctx.fillStyle = "white"; // Set the fill color for the text
            this.ctx.font = "16px Arial"; // Set the font and size for the text
    
            // Draw the message
            if (currentItem === ripple) {
                this.ctx.fillText("Current item: Ripple", 8, 60);
            } else {
                this.ctx.fillText("Current item: Arrow", 8, 60);
            }
        }
    }
    
    


    update() {
        if (!this.gameIsOver) {
            for (let i = 0; i < this.invaders.length; i++) {
                // Game is over if the invader reaches the bottom of the screen
                if (this.invaders[i].y > this.canvas.height) {
                    this.invaders.splice(this.invaders.indexOf(this.invaders[i], 1));
                    this.gameIsOver = true;
                }
            }

            this.missiles.forEach((missile) => {
                this.invaders.forEach((invader) => {
                    // Collision happens
                    if (missile.collides(invader)) {
                        // Check if the missile type matches the invader type
                        if ((currentItem === ripple && invader.imgsrc === "./assets/broken-heart.png")) {
                            // Ripple hits broken heart - play healing sound
                            explosion.play();
                            this.invaders.splice(this.invaders.indexOf(invader), 1);
                            this.numDeadInvaders++;
                            // Get one item
                            if (this.numMissiles < 10) {
                                this.numMissiles++;
                            }
                        } else if (currentItem === arrow && invader.imgsrc === "./assets/broken-heart.png") {
                            // Arrow hits the broken heart - play punch sound
                           punch.play();
                           this.invaders.splice(this.invaders.indexOf(invader), 1);
                           this.numHeartBreaks++;
                        } else if ((currentItem === arrow && invader.imgsrc === "./assets/heart.png")) {
                            // Arrow hits the true love heart - play dreamy sound
                            // play dreamy sound
                            this.invaders.splice(this.invaders.indexOf(invader), 1);
                        }
                        invader.isHit = true;


                        // Missile exits the canvas
                    } else if (missile.y < 0) {
                        if (this.numMissiles < 10) {
                            this.numMissiles++;
                        }
                        this.missiles.splice(this.missiles.indexOf(missile), 1);
                    }
                });
            });
            
        }

        // Always updated on screen 
        this.ctx.font = "16px Arial";
        this.ctx.fillStyle = "#0095DD";
        this.ctx.fillText("Invaders shot down: " + this.numDeadInvaders, 8, 20);
        if (this.gameIsOver) {
            this.ctx.fillText("Game Over!", 8, 40);
            this.subject.x = this.canvas.width / 2 - 25;
            this.subject.y = this.canvas.height - 60;
            backgroundMusic.pause();
        } else {
            this.ctx.fillText("Missiles remaining: " + this.numMissiles, 8, 40);
        }
    }
}
export default Game;