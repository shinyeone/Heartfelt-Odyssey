import Invader from "./Invader.js";
import Subject from "./Subject.js";
import Item from "./Item.js";


// List of sounds for the game
const backgroundMusic = new Audio("./assets/bg_music.mp3");
const shoot = new Audio("./assets/chime.mp3");
const explosion = new Audio("./assets/fairy2.mp3");
const punch = new Audio("./assets/punch.wav");
const dreamy = new Audio("./assets/dreamy.mp3");

// List of items 
const arrow = "./assets/arrow.png";[]
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
        }, 15000); // 15000 milliseconds = 15 seconds



        // Create a items array
        this.items = [];
        this.numItems = 10;
        document.addEventListener("keydown", this.keyDownHandler.bind(this));

        // Create an invaders array
        this.invaders = [];
        this.numDeadInvaders = 0;
        this.numHeartBreaks = 0;
    }

    keyDownHandler(e) {
        // Each space bar press creates a item
        if (e.key === " ") {
            if (this.numItems > 0) {
                if (currentItem === ripple) {
                    let item = new Item(
                        currentItem,
                        this.subject.x + 10 ,
                        this.subject.y - 20,
                        30,
                        45
                    );
                    this.items.push(item);
                    shoot.play();
                    this.numItems--;
                } else {
                    // Arrow (Limited to 5)
                    let item = new Item(
                        currentItem,
                        this.subject.x + 10 ,
                        this.subject.y,
                        10,
                        35
                    );
                    this.items.push(item);
                    shoot.play();
                    this.numItems--;
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
    
            // draws the items (ripples)
            for (let j = 0; j < this.items.length; j++) {
                this.items[j].draw(this.ctx);
                this.items[j].move();
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

        if (!this.gameStarts) {
            this.ctx.fillText("Press Left or Right Key to Start the Game", 90, 300);
        }
        if (!this.gameIsOver) {
            for (let i = 0; i < this.invaders.length; i++) {
                // Game is over if the invader reaches the bottom of the screen
                if (this.invaders[i].y > this.canvas.height - this.invaders[i].height) {
                    this.invaders.splice(i, 1);
                    this.gameIsOver = true;
                    break;
                }
            }
    
            this.items.forEach((item, itemIndex) => {
                let collisionOccurred = false; // Flag to keep track if a collision occurred
                for (let i = 0; i < this.invaders.length; i++) {
                    const invader = this.invaders[i];
            
                    // Collision happens
                    if (item.collides(invader)) {
                        console.log(invader);
                        // Check if the item type matches the invader type
                        if (
                            currentItem === ripple &&
                            invader.imgsrc === "./assets/broken-heart.png"
                        ) {
                            // Ripple hits broken heart - play healing sound
                            explosion.play();
                            console.log("ripple hits broken heart")
                            this.invaders.splice(i, 1);
                            this.numDeadInvaders++;
                            if (this.numItems < 10) {
                                this.numItems++;
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
                        break; // Stop checking for other collisions for this item
                    }
                }
            
                if (collisionOccurred) {
                    // Remove the item after a collision
                    this.items.splice(itemIndex, 1);
                }
            });
            
    
            // Remove the item if it exits the canvas
           // Remove the item if it exits the canvas and add one item in that case
           this.items = this.items.filter(item => {
            if (item.y <= 0) {
                if (this.numItems < 10) {
                    this.numItems++;
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
            "Broken Hearts Healed: " + this.numDeadInvaders,
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
            this.ctx.fillText("Tolerance capacity remaining: " + this.numItems, 8, 60);
        }
    }
    
    }
    
    
    
    export default Game;
    