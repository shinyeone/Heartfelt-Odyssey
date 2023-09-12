import Invader from "./Invader.js";
import Subject from "./Subject.js";
import Missile from "./Missile.js";


// List of sounds for the game
const backgroundMusic = new Audio("./assets/bg_music.mp3");
const shoot = new Audio("./assets/chime.mp3");
const explosion = new Audio("./assets/fairy2.mp3");
const punch = new Audio("./assets/punch.wav");
const dreamy = new Audio("./assets/dreamy.mp3");

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

    createInvaderList() {
        if (!this.invadersShouldStart) {
            return; // Don't create invaders until the timer is up
        }
    
        const rand = Math.random();
        // Adjust these probabilities as needed to control the appearance frequency
        if (rand < 0.0001) { // 0.01% chance of heart
            this.invaders.push(new Invader(
                "./assets/heart.png",
                (this.canvas.width - 10) * Math.random(),
                this.canvas.height - 600,
                42,
                42,
                Math.random() > 0.5 // 50% chance
            ));
        } else if (rand < 0.005) { // 0.5% chance of broken heart
            this.invaders.push(new Invader(
                "./assets/broken-heart.png",
                (this.canvas.width - 10) * Math.random(),
                this.canvas.height - 600,
                42,
                42,
                Math.random() > 0.5 // 50% chance
            ));
        }
        console.log(this.invaders);
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
                this.ctx.fillText("Current item: Ripple", 8, 80);
            } else {
                this.ctx.fillText("Current item: Arrow", 8, 80);
            }
        }
    }

    update() {
        if (!this.gameIsOver) {
            for (let i = 0; i < this.invaders.length; i++) {
                // Game is over if the invader reaches the bottom of the screen
                if (this.invaders[i].y > this.canvas.height - this.invaders[i].height) {
                    this.invaders.splice(i, 1);
                    this.gameIsOver = true;
                    break;
                }
            }
    
            this.missiles.forEach((missile, missileIndex) => {
                let collisionOccurred = false; // Flag to keep track if a collision occurred
                for (let i = 0; i < this.invaders.length; i++) {
                    const invader = this.invaders[i];
            
                    // Collision happens
                    if (missile.collides(invader)) {
                        console.log(invader);
                        // Check if the missile type matches the invader type
                        if (
                            currentItem === ripple &&
                            invader.imgsrc === "./assets/broken-heart.png"
                        ) {
                            // Ripple hits broken heart - play healing sound
                            explosion.play();
                            console.log("ripple hits broken heart")
                            this.invaders.splice(i, 1);
                            this.numDeadInvaders++;
                            if (this.numMissiles < 10) {
                                this.numMissiles++;
                            }


                        } else if (
                            currentItem === arrow &&
                            invader.imgsrc === "./assets/broken-heart.png"
                        ) {
                            // Arrow hits the broken heart - play punch sound
                            punch.play();
                            console.log("arrow hits broken heart")
                            this.invaders.splice(i, 1);
                            this.numHeartBreaks++;

                        } else if (
                            currentItem === arrow &&
                            invader.imgsrc === "./assets/heart.png"
                        ) {
                            // Arrow hits the true love heart - play dreamy sound
                            dreamy.play();
                            this.invaders.splice(i, 1);
                        }
            
                        invader.isHit = true;
                        collisionOccurred = true;
                        break; // Stop checking for other collisions for this missile
                    }
                }
            
                if (collisionOccurred) {
                    // Remove the missile after a collision
                    this.missiles.splice(missileIndex, 1);
                }
            });
            
    
            // Remove the missile if it exits the canvas
           // Remove the missile if it exits the canvas and add one missile in that case
           this.missiles = this.missiles.filter(missile => {
            if (missile.y <= 0) {
                if (this.numMissiles < 10) {
                    this.numMissiles++;
                }
                return false;
            }
            return true;
            });
        }
    
        // Always updated on screen
        this.ctx.font = "16px Arial";
        this.ctx.fillStyle = "#0095DD";
        this.ctx.fillText(
            "Invaders shot down: " + this.numDeadInvaders,
            8,
            20
        );
        this.ctx.fillText(
            "Heartbreaks: " + this.numHeartBreaks,
            8,
            40
        );
        if (this.gameIsOver) {
            this.ctx.fillText("Game Over!", 8, 60);
            this.subject.x = this.canvas.width / 2 - 25;
            this.subject.y = this.canvas.height - 60;
            backgroundMusic.pause();
        } else {
            this.ctx.fillText("Missiles remaining: " + this.numMissiles, 8, 60);
        }
    }
    
    }
    
    
    
    export default Game;
    