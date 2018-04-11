// Enemies our player must avoid
//SEt up class to generate Enemies
class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 200;
        this.sprite = 'images/enemy-bug.png';
    }

    update(dt) {
        //Multiplying by dt to ensure same speed on all computers
        this.x += this.speed * dt;
        //If bugs reach end of board, set them back to left side and give new random speed
        if (this.x > 6.5 * 101) {
            this.x = -101;
            this.speed = Math.floor(Math.random() * 400) + 120;
        }
    }

    // Draw the enemy on the screen, required method for game
    // Subtracted 25 from y position to make enemies fit nicer in the middle of tiles
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y - 25);
    }

}
//Player class to generate player
class Player {
    constructor() {
        this.lives = 3;
        this.sprite = 'images/char-boy.png';
        this.x = 3 * 101;
        this.y = 5 * 83;
    }
    // Manipulate and move the player on canvas area
    update() {
        const mario = document.querySelector(".mario");
        //set up if conditions to make sure player does not go out of the game tiles and play appropriate sounds and score update when reached to other side of path and flash green
        if (this.x < 0) {
            this.x = 0;
        } else if (this.x > 6 * 101) {
            this.x = 6 * 101;
        } else if (this.y > 5 * 83) {
            this.y = 5 * 83;
        } else if (this.y == 0) {
            this.y = 5 * 83;
            points.scoreUp();
            mario.currentTime = 0;
            mario.play();
            document.body.classList.add("green-flash");
            setTimeout(function () {
                document.body.classList.remove("green-flash");
            }, 60);
        }

        const punch = document.querySelector(".punch");
        //set up absolute distance for player and each bug, if value is less than set in the if statement, consider it a collision and update score plus flash red acordingly
        const distanceX1 = Math.abs((en1["x"]) - this.x);
        const distanceX2 = Math.abs((en2["x"]) - this.x);
        const distanceX3 = Math.abs((en3["x"]) - this.x);
        const distanceY1 = Math.abs((en1["y"]) - this.y);
        const distanceY2 = Math.abs((en2["y"]) - this.y);
        const distanceY3 = Math.abs((en3["y"]) - this.y);
        // Handle collisions with the player
        if ((distanceX1 < 60 && distanceY1 < 40) || (distanceX2 < 60 && distanceY2 < 40) || (distanceX3 < 60 && distanceY3 < 40)) {
            this.x = 3 * 101;
            this.y = 5 * 83;
            this.lives--;
            points.scoreDown();
            punch.currentTime = 0;
            punch.play();
            document.body.classList.add("red-flash");
            setTimeout(function () {
                document.body.classList.remove("red-flash");
            }, 90);
        }
        // if dtstrmrnts to update hearts display based on lives remaining
        if (this.lives == 2) {
            document.querySelector("#heartThree").classList.remove("fas");
            document.querySelector("#heartThree").classList.add("far");
        }
        if (this.lives == 1) {
            document.querySelector("#heartTwo").classList.remove("fas");
            document.querySelector("#heartTwo").classList.add("far");
        }
        if (this.lives == 0) {
            document.querySelector("#heartOne").classList.remove("fas");
            document.querySelector("#heartOne").classList.add("far");
            finito();
            restartKeys = [32];
        }
    }

    // Draw the player on the screen, required method for game
    // subtracted 25 from y position here as well to make player fit nicer on middle of tile
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y - 25);
    }

    // Handle user input for controlling the player
    handleInput(arrow) {
        if (arrow == 'left') {
            this.x -= 101;
        } else if (arrow == 'up') {
            this.y -= 83;
        } else if (arrow == 'right') {
            this.x += 101;
        } else if (arrow == 'down') {
            this.y += 83;
        }
    }

}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

// set up three enemies at definid locations, future levels might havem ore enemies and etc..
const allEnemies = [new Enemy(0, 83), new Enemy(101, 83 * 2), new Enemy(202, 83 * 3)];
[en3, en2, en1] = allEnemies;
const player = new Player();

// incorporate the Map() to list allowed keys instead using an array for example
// for now the Map() is empty so user cant move player while welcome screen is shown
let allowedKeys = new Map();
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    player.handleInput(allowedKeys.get(e.keyCode));
    const blop = document.querySelector(".blop");
    blop.currentTime = 0;
    allowedKeys.has(e.keyCode) ? blop.play() : null;
});

//ADDITIONAL FUNCTIONALITIES

// class or just simply higher function for updating score
class Points {
    constructor() {
        this.score = 0;
        this.points = document.querySelector('.points');
    }

    scoreUp() {
        this.score += 100;
        this.points.textContent = this.score;
    }

    scoreDown() {
        this.score -= 50;
        this.score <= 0 ? this.score = 0 : this.score;
        this.points.textContent = this.score;
    }
}

let points = new Points();

const audio = document.querySelector(".arcade-music");

// function to mute/unmute game music
const musicOn = () => {
    const speaker = document.querySelector(".speaker");
    speaker.classList.toggle("red-speaker");
    audio.muted = !audio.muted;
    // audio.paused ? audio.play() : audio.muted=!audio.muted;
}

//Hide Welcoming modal
const hideWelcome = () => {
    const welcome = document.querySelector(".welcome");
    const audio = document.querySelector(".arcade-music");
    allowedKeys.set(37, 'left');
    allowedKeys.set(38, 'up');
    allowedKeys.set(39, 'right');
    allowedKeys.set(40, 'down');
    welcome.style.display = "none";
    audio.currentTime = 0;
    stopwatch.start();
    audio.play();
    // setTimeout(() => {
    //     finito();
    // }, 12000);
}

let allowedStartKeys = [13];
let restartKeys = [];

document.addEventListener('keyup', (e) => {
    allowedStartKeys.includes(e.keyCode) ? hideWelcome() : null;
    restartKeys.includes(e.keyCode) ? restart() : null;
    e.keyCode == 77 ? musicOn() : null;
    allowedStartKeys = [];

});

// function to use when game lost or finished
const finito = () => {
    allowedKeys.clear();
    setTimeout(() => {
        document.querySelector(".modal").style.display = 'block';
        stopwatch.time.textContent = 30;
        // stop();
    }, 200);
    if (player.lives > 0) {
        document.querySelector(".end-message").innerHTML = `You earned&nbsp;<em class="total"> </em>&nbsp;points.`;
        document.querySelector(".total").textContent = points.score;
    } else if (player.lives == 0) {
        document.querySelector(".end-message").textContent = "You Loose..."
    }
    restartKeys = [32];
}

// function to restart gmae
const restart = () => {
    player.lives = 3;
    let hearts = document.querySelectorAll(".fa-heart");
    //NOT SURE WHY forEach, for-of or regular for loop are not working properly??? Had to use individual query selectors for each heart instead as seen below...
    // hearts.forEach(heart => {
    //     heart.classList.remove("far");
    //     heart.classList.add("fas");
    // });
    setTimeout(() => {
        points.score = 0;
        document.querySelector(".modal").style.display = 'none';
        document.querySelector(".points").textContent = points.score;
        document.querySelector("#heartOne").classList.remove("far");
        document.querySelector("#heartOne").classList.add("fas");
        document.querySelector("#heartTwo").classList.remove("far");
        document.querySelector("#heartTwo").classList.add("fas");
        document.querySelector("#heartThree").classList.remove("far");
        document.querySelector("#heartThree").classList.add("fas");
        // stop();
    }, 200);
    allowedKeys.set(37, 'left');
    allowedKeys.set(38, 'up');
    allowedKeys.set(39, 'right');
    allowedKeys.set(40, 'down');
    audio.currentTime = 0;
    stopwatch.restart();
    stopwatch.start();
    audio.play();
}

// stopwatch class
class Stopwatch {
    constructor(time) {
        this.seconds = 30;
        this.time = document.querySelector(".seconds");
    }

    start() {
        clearInterval(this.interval);
        this.interval = setInterval(() => {
            this.seconds -= 1;
            this.time.textContent = `${this.seconds}`;
            if (this.seconds <= 0) {
                // this.seconds = 0;
                clearInterval(this.interval);
                finito();
            }
        }, 1000);
    }

    restart() {
        this.seconds = 30;
    }
}

let stopwatch = new Stopwatch();