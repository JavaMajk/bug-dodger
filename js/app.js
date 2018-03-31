// Enemies our player must avoid
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
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y - 25);
    }

}
//Player class
class Player {
    constructor() {
        this.lives = 3;
        this.sprite = 'images/char-boy.png';
        this.x = 3 * 101;
        this.y = 5 * 83;
    }
    // Update the player's postion, required method for game
    update() {
        const mario = document.querySelector(".mario");
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
            punch.play();
            restartKeys = [32];
            document.body.classList.add("red-flash");
            setTimeout(function () {
                document.body.classList.remove("red-flash");
            }, 90);
        }
        if (this.lives == 2) {

        }
        if (this.lives == 0) {
            // $("#heartOne").removeClass("fas fa-heart").addClass("far fa-heart");
            finito();
            restartKeys = [32];
        }
    }

    // Draw the player on the screen, required method for game
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
const allEnemies = [new Enemy(0, 83), new Enemy(101, 83 * 2), new Enemy(202, 83 * 3)];
[en3, en2, en1] = allEnemies;
const player = new Player();


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
    audio.play();
    // setTimeout(() => {
    //     //STOP GAME
    // }, 5000);
}

let allowedStartKeys = [13];
let restartKeys = [];

document.addEventListener('keyup', (e) => {
    allowedStartKeys.includes(e.keyCode) ? hideWelcome() : null;
    restartKeys.includes(e.keyCode) ? restart() : null;
    e.keyCode == 77 ? musicOn() : null;
    allowedStartKeys = [];

});

const finito = () => {
    allowedKeys.clear();
    setTimeout(() => {
        document.querySelector(".modal").style.display = 'block';
        document.querySelector(".total").textContent = points.score;
        // stop();
    }, 200);
}

const restart = () => {
    window.location.reload(false);
    allowedStartKeys = [13];
}