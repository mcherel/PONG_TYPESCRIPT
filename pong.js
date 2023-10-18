/* COLORS */
const colorPlayer1 = 'blue';
const colorPlayer2 = 'red';
const fontStyle = "45px Courier New";
const backgroundColor = "green";
const ballColor = "yellowgreen";
const defaultColor = "white";
/* VALUES */
const startMessage = "Press any key to begin";
const netInterval = 5;
const netWidth = 2;
const ballRadius = 9;
const ballSpeed = 7;
const ballSpeedPace = 0.2;
const paddleHeight = 100;
const paddleWidth = 10;
const framePerSecond = 50;
const computerLevel = 0.1;
const roundsMax = 2;
/* SELECT CANVAS */
//const canvas = document.getElementById("pong");
const canvas = document.getElementById("pong");
//const context = canvas.getContext("2d");
const context = canvas === null || canvas === void 0 ? void 0 : canvas.getContext("2d");
/* GAME */
const game = {
    running: false
};
/* USER PADDLE */
const user = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: colorPlayer1,
    score: 0
};
/* COMPUTER PADDLE */
const com = {
    x: canvas.width - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: colorPlayer2,
    score: 0
};
/* BALL */
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: ballRadius,
    speed: ballSpeed,
    color: ballColor,
    velocityX: 5,
    velocityY: 5
};
/* DRAW RECT */
function drawRect(x, y, w, h, color) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}
/* CREATE THE NET */
const net = {
    x: canvas.width / 2 - netWidth / 2,
    y: 0,
    width: netWidth,
    height: netInterval,
    color: defaultColor
};
/* DRAW NET */
function drawNet() {
    for (let i = 0; i <= canvas.height; i += netInterval + 2) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}
/* DRAW CIRCLE */
function drawCircle(x, y, r, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
}
/* DRAW TEXT */
function drawText(text, x, y, color) {
    context.fillStyle = color;
    context.font = fontStyle;
    context.fillText(text, x, y);
}
/* RENDER THE GAME */
function render() {
    //clear canvas
    drawRect(0, 0, canvas.width, canvas.height, backgroundColor);
    drawNet();
    //draw score
    drawText(user.score, canvas.width / 4, canvas.height / 5, colorPlayer1);
    drawText(com.score, (3 * canvas.width / 4), canvas.height / 5, colorPlayer2);
    //draw paddles
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);
    //draw ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}
canvas.addEventListener("mousemove", movePaddle);
canvas.addEventListener("keydown", start);
function movePaddle(evt) {
    let rect = canvas.getBoundingClientRect();
    user.y = evt.clientY - rect.top - user.height / 2;
}
/* BALL RESET */
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = -ball.velocityX;
    ball.speed = ballSpeed;
    //ball.velocityY = -ball.velocityY;
}
function collision(ball, paddle) {
    ball.top = ball.y - ball.radius;
    ball.bottom = ball.y + ball.radius;
    ball.left = ball.x - ball.radius;
    ball.right = ball.x + ball.radius;
    paddle.top = paddle.y + 1;
    paddle.bottom = paddle.y + paddle.height + 1;
    paddle.left = paddle.x + 1;
    paddle.right = paddle.x + paddle.width + 1;
    //returns true or fance for the collision
    return ball.right > paddle.left
        && ball.bottom > paddle.top
        && ball.left < paddle.right
        && ball.top < paddle.bottom;
}
/* UPDATE GAME  */
function gameUpdate() {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    ///AI
    com.y += (ball.y - (com.y + com.height / 2)) * computerLevel;
    let player = (ball.x + ball.radius < canvas.width / 2) ? user : com;
    if (collision(ball, player)) {
        //where the ball hit the player
        let collidePoint = (ball.y - (player.y + player.height / 2));
        //normalization
        collidePoint = collidePoint / (player.height / 2);
        //calculate angle in Radian
        let angleRad = collidePoint * (Math.PI / 4);
        // X direction of the ball when it's hit
        let direction = ((ball.x + ball.radius) < canvas.width / 2) ? 1 : -1;
        //change velocity X an y
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        ball.speed += ballSpeedPace;
    }
    //changing direction
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }
    if (ball.x - ball.radius < 0) {
        com.score++;
        resetBall();
    }
    else if (ball.x + ball.radius > canvas.width) {
        user.score++;
        resetBall();
    }
    if (com.score === roundsMax || user.score === roundsMax) {
        game.running = false;
        user.color = com.color = backgroundColor; //paddles become transparents in the end of game
    }
    console.log(game.running);
}
function listen() {
    render();
    if (game.running === false) {
        start();
    }
    else {
        gameUpdate();
    }
}
function start() {
    render();
    context.font = fontStyle;
    context.fillStyle = backgroundColor;
    context.fillRect(canvas.width / 2 - 300, canvas.height / 2 - 50, 700, 100);
    // Change the canvas color;
    context.fillStyle = defaultColor;
    let message;
    if (com.score === roundsMax || user.score === roundsMax)
        com.score === roundsMax ? message = "GAME OVER" : message = "YOU WIN";
    else
        message = startMessage;
    // Draw the 'press any key to begin' text
    context.textAlign = "center";
    context.fillText(message, canvas.width / 2, canvas.height / 2 + 15);
    document.addEventListener("keydown", function () {
        if (game.running === false && user.score === 0 && com.score === 0) {
            game.running = true;
            console.log(game.running);
            /* LOOP */
            setInterval(listen, 1000 / framePerSecond);
        }
    });
}
start();
