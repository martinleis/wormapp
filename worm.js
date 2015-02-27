var gameOn, ctx, worm, food;
var bestScore = 0;

function Worm(color, speedRight) {
	this.color = color;
	this.speedHeadRight = speedRight;
	this.speedHeadDown = 0;
	this.speedTailRight = speedRight;
	this.speedTailDown = 0;
	this.tailX = canvas.width/2;
	this.headX = canvas.width/2;
	this.tailY = canvas.height/2;
	this.headY = canvas.height/2;
	this.bendPoints = []; // will include coordinates & new speed to all bending points
	this.scanner = [this.headX + speedRight, this.headY-5, 1, 10]; // includes coordinates, width and length of what's ahead
	this.timeSinceLastMeal = 0
	this.score = 0;
	$("#score").html(this.score);
}

function Food(color) {
	this.color = color;
	this.x = Math.random()*(canvas.width - 15);
	this.y = Math.random()*(canvas.height - 15);
}

$(document).keydown(function(event) {

	if (event.which >= 37 && event.which <= 40) {
		// only prevent default for functional keystrokes
		event.preventDefault();
	}
	switch (event.which) {
	case 37://left
		if (worm.speedHeadRight === 0) {
			worm.bendPoints.push([worm.headX, worm.headY, -1, 0]);
			worm.speedHeadRight = -1;
			worm.speedHeadDown = 0;
			worm.scanner = [worm.headX-1, worm.headY-5, 1, 10];
		}
		break;
	case 38://up
		if (worm.speedHeadDown === 0) {
			worm.bendPoints.push([worm.headX, worm.headY, 0, -1]);
			worm.speedHeadRight = 0;
			worm.speedHeadDown = -1;
			worm.scanner = [worm.headX-5, worm.headY-1, 10, 1];
		}
		break;
	case 39://right
		if (worm.speedHeadRight === 0) {
			worm.bendPoints.push([worm.headX, worm.headY, 1, 0]);
			worm.speedHeadRight = 1;
			worm.speedHeadDown = 0;
			worm.scanner = [worm.headX+1, worm.headY-5, 1, 10];
		}
		break;
	case 40://down
		if (worm.speedHeadDown === 0) {
			worm.bendPoints.push([worm.headX, worm.headY, 0, 1]);
			worm.speedHeadRight = 0;
			worm.speedHeadDown = 1;
			worm.scanner = [worm.headX-5, worm.headY+1, 10, 1];
		}
		break;
	}
});

function drawWorm(ctx) {
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();
	ctx.lineWidth = 10;
	ctx.strokeStyle = worm.color;
	ctx.moveTo(worm.tailX, worm.tailY); // start drawing from tail
	for (var i = 0; i < worm.bendPoints.length; i++) {
		 // draw to each endpoint's coordinates
		ctx.lineTo(worm.bendPoints[i][0], worm.bendPoints[i][1])
	}
	ctx.lineTo(worm.headX, worm.headY); // finally draw to head
	ctx.stroke();
	ctx.fillStyle = food.color;
	ctx.fillRect(food.x, food.y, 15, 15);
	var imgData = ctx.getImageData(worm.scanner[0], worm.scanner[1], worm.scanner[2], worm.scanner[3]);

	for (var i = 0; i < 40; i+=4) {
		if (imgData.data[i] === 0 && imgData.data[i+1] === 0 && imgData.data[i+2] === 0 && imgData.data[i+3] === 255) {//if collide with food
			worm.score++;
			$("#score").html(worm.score);
			worm.timeSinceLastMeal = 0;
			food = new Food("black");
			break;
		}
		if (imgData.data[i+3] === 0) {//if outside canvas
			clearInterval(gameOn);
			updateBestScore();
	 		alert("Game over!");
			break;
		}
	}
	if (worm.timeSinceLastMeal >= 50) {
		worm.tailX += worm.speedTailRight;
		worm.tailY += worm.speedTailDown;
	}
	worm.headX += worm.speedHeadRight;
	worm.headY += worm.speedHeadDown;
	worm.scanner[0] += worm.speedHeadRight;
	worm.scanner[1] += worm.speedHeadDown;
	worm.timeSinceLastMeal++;
	
	if (worm.bendPoints[0] && worm.tailX === worm.bendPoints[0][0]
			&& worm.tailY === worm.bendPoints[0][1]) { // tail reaches last bending point
		worm.speedTailRight = worm.bendPoints[0][2];
		worm.speedTailDown = worm.bendPoints[0][3];
		worm.bendPoints.shift();
	}
}

function updateBestScore() {
	if (worm && worm.score > bestScore) {
		bestScore = worm.score;
	}
	$("#bestScore").html(bestScore);
}

$(document).ready(function() {
	ctx = $("#canvas")[0].getContext("2d");
	$("#newGame").on("click", function() {
		clearInterval(gameOn);
		updateBestScore();
		worm = new Worm("red", 1);
		food = new Food("black");
		gameOn = setInterval(function() {
			drawWorm(ctx)
		}, 10);
		if ($("#pause").hasClass("paused")) {
			$("#pause").removeClass("paused").attr("value", "Pause");
		}
	});
	$("#pause").on("click", function() {
		if (!$(this).hasClass("paused")) {
			clearInterval(gameOn);
			$(this).addClass("paused").attr("value", "Resume");
		} else {
			gameOn = setInterval(function() {
				drawWorm(ctx)
			}, 10);
			$(this).removeClass("paused").attr("value", "Pause");
		}
	});
});