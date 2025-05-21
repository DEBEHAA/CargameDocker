const score = document.querySelector(".score");
const startScreen = document.querySelector(".startScreen");
const gameArea = document.querySelector(".gameArea");

let player = {
    speed: 5,
    start: false,
    score: 0,
    timeLeft: 60, // in seconds
};

let keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
};

let timeInterval;

// Event listeners
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function keyDown(e) {
    e.preventDefault();
    keys[e.key] = true;
}

function keyUp(e) {
    e.preventDefault();
    keys[e.key] = false;
}

function startGame() {
    score.classList.remove("hide");
    startScreen.classList.add("hide");
    gameArea.innerHTML = "";

    player.start = true;
    player.score = 0;
    player.timeLeft = 60;

    window.requestAnimationFrame(gamePlay);

    // Create road lines
    for (let i = 0; i < 5; i++) {
        let line = document.createElement("div");
        line.classList.add("line");
        line.y = i * 150;
        line.style.top = line.y + "px";
        gameArea.appendChild(line);
    }

    // Create player car
    let car = document.createElement("div");
    car.setAttribute("class", "car");
    gameArea.appendChild(car);

    player.x = car.offsetLeft;
    player.y = car.offsetTop;

    // Create enemy cars
    for (let i = 0; i < 3; i++) {
        let enemyCar = document.createElement("div");
        enemyCar.setAttribute("class", "enemyCar");
        enemyCar.style.backgroundImage = `url("assets/module2-images/car${i + 1}.png")`;
        enemyCar.y = (i + 1) * 350 * -1;
        enemyCar.style.top = enemyCar.y + "px";
        enemyCar.style.left = Math.floor(Math.random() * 350) + "px";
        gameArea.appendChild(enemyCar);
    }

    // Start timer countdown
    timeInterval = setInterval(() => {
        if (player.timeLeft > 0) {
            player.timeLeft--;
        } else {
            clearInterval(timeInterval);
            endGame("Time's up! You won!");
        }
    }, 1000);
}

function gamePlay() {
    let car = document.querySelector(".car");
    let road = gameArea.getBoundingClientRect();

    if (player.start) {
        moveLines();
        moveEnemyCar(car);

        if (keys.ArrowUp && player.y > road.top + 100) player.y -= player.speed;
        if (keys.ArrowDown && player.y < road.bottom - 120) player.y += player.speed;
        if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
        if (keys.ArrowRight && player.x < road.width - 50) player.x += player.speed;

        car.style.top = player.y + "px";
        car.style.left = player.x + "px";

        window.requestAnimationFrame(gamePlay);

        player.score++;
        score.innerHTML = `Score: ${player.score} | Time Left: ${player.timeLeft}s`;
    }
}

function moveLines() {
    let lines = document.querySelectorAll(".line");
    lines.forEach(line => {
        if (line.y >= 700) {
            line.y -= 750;
        }
        line.y += player.speed;
        line.style.top = line.y + "px";
    });
}

function moveEnemyCar(car) {
    let enemyCars = document.querySelectorAll(".enemyCar");
    enemyCars.forEach(enemyCar => {
        if (isCollide(car, enemyCar)) {
            endGame("Game Over! You hit another car.");
        }

        if (enemyCar.y >= 750) {
            enemyCar.y = -300;
            enemyCar.style.left = Math.floor(Math.random() * 350) + "px";
        }

        enemyCar.y += player.speed;
        enemyCar.style.top = enemyCar.y + "px";
    });
}

function isCollide(a, b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();

    return !(
        aRect.bottom < bRect.top ||
        aRect.top > bRect.bottom ||
        aRect.right < bRect.left ||
        aRect.left > bRect.right
    );
}

function endGame(message) {
    clearInterval(timeInterval);
    player.start = false;
    startScreen.classList.remove("hide");
    alert(message);
}

// ✅ Very important: This enables the game to start when clicked
startScreen.addEventListener("click", startGame);
