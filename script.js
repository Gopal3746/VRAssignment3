var maxFps = 60;  
let fpsDisplay = 0;
let score = 0; 
let fpsTimeAccumulator = 0; 
let fpsFrameCount = 0; 

window.onload = function() {
    var canvas = document.getElementById("gameCanvas");
    var context = canvas.getContext("2d");

    const player = { x: canvas.width / 2 - 10, y: canvas.height - 40, width: 20, height: 20, speed: 5 };
    let obstacles = [];
    const gravity = 2;
    let gameOver = false;

    const timeStep = 1000 / maxFps;
    let lastFrameTime = 0;
    let accumulatedTime = 0;

    let leftPressed = false;
    let rightPressed = false;
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);

    function keyDownHandler(e) {
        if (e.key === 'Right' || e.key === 'ArrowRight') {
            rightPressed = true;
        } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
            leftPressed = true;
        }
    }

    function keyUpHandler(e) {
        if (e.key === 'Right' || e.key === 'ArrowRight') {
            rightPressed = false;
        } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
            leftPressed = false;
        }
    }

    requestAnimationFrame(mainLoop);

    function mainLoop(currentTime) {
        const deltaTime = currentTime - lastFrameTime;
        lastFrameTime = currentTime;
        accumulatedTime += deltaTime;

        fpsTimeAccumulator += deltaTime;
        fpsFrameCount++;

        if (fpsTimeAccumulator >= 1000) {
            fpsDisplay = Math.round(fpsFrameCount / (fpsTimeAccumulator / 1000));
            fpsFrameCount = 0;
            fpsTimeAccumulator = 0;
        }

        processInput();
        while (accumulatedTime >= timeStep) {
            update();
            accumulatedTime -= timeStep;
        }
        draw();

        if (!gameOver) {
            requestAnimationFrame(mainLoop);
        }
    }

    function processInput() {
        if (leftPressed && player.x > 0) {
            player.x -= player.speed;
        }
        if (rightPressed && player.x + player.width < canvas.width) {
            player.x += player.speed;
        }
    }

    function update() {
        obstacles.forEach(obstacle => {
            if (player.x < obstacle.x + obstacle.width && player.x + player.width > obstacle.x &&
                player.y < obstacle.y + obstacle.height && player.y + player.height > obstacle.y) {
                gameOver = true;
            }
        });

        if (obstacles.length === 0 || obstacles[obstacles.length - 1].y > 100) {
            createObstacle();
        }
        obstacles = obstacles.filter(obstacle => obstacle.y < canvas.height);
        obstacles.forEach(obstacle => {
            obstacle.y += gravity;
            if (obstacle.y + obstacle.height > canvas.height && !obstacle.scored) {
                score++;
                obstacle.scored = true;
            }
        });
    }

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = '#00f';
        context.fillRect(player.x, player.y, player.width, player.height);

        context.fillStyle = '#f00';
        obstacles.forEach(obstacle => {
            context.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });

        context.font = "16px Arial";
        context.fillStyle = "white";
        context.textAlign = "left";
        context.fillText("FPS: " + fpsDisplay, 10, 20);

        context.fillText("Score: " + score, 10, 40);

        if (gameOver) {
            context.font = "30px Arial";
            context.fillStyle = "white";
            context.textAlign = "center";
            context.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 20);
        }
    }

    function createObstacle() {
        const obstacleWidth = 50;
        const obstacleHeight = 20;
        const obstacleX = Math.random() * (canvas.width - obstacleWidth);
        obstacles.push({ x: obstacleX, y: 0, width: obstacleWidth, height: obstacleHeight, scored: false });
    }
}
