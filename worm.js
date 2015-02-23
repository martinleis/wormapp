var bestScore = 0;
var score,
    speedHeadRight, speedHeadDown, speedTailRight, speedTailDown,
    tailX, tailY, headX, headY,
    bendPoints;
function initialize(){
  score = 0,
  speedHeadRight = 1, speedHeadDown = 0, speedTailRight = 1, speedTailDown = 0,
  tailX = 450, tailY = 250, headX = 500, headY = 250,
  bendPoints = []; //will include coordinates & new speed to all bending points
}

$(document).keydown(function(key) {
  key.preventDefault();
  switch(key.which) {
    case 37:
      bendPoints.push([headX, headY, -1, 0]);
      speedHeadRight = -1; speedHeadDown = 0;
      break;
    case 38:
      bendPoints.push([headX, headY, 0, -1]);
      speedHeadRight = 0; speedHeadDown = -1;
      break;
    case 39:
      bendPoints.push([headX, headY, 1, 0]);
      speedHeadRight = 1; speedHeadDown = 0;
      break;
    case 40:
      bendPoints.push([headX, headY, 0, 1]);
      speedHeadRight = 0; speedHeadDown = 1;
      break;
  }
});

var myCanvas = document.getElementById("canvas");
var ctx = myCanvas.getContext("2d");

function drawWorm(ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.lineWidth = 10;
  ctx.strokeStyle = "red";
  ctx.moveTo(tailX, tailY); //start drawing from tail
  for(var i = 0; i < bendPoints.length; i++){
    ctx.lineTo(bendPoints[i][0], bendPoints[i][1]) //draw to each bendpoint's coordinates
  }
  ctx.lineTo(headX, headY); //finally draw to mouth
  ctx.stroke();
  
  if(headX === 0 || headX === canvas.width || headY === 0 || headY === canvas.height){
    clearInterval(worm);
    alert("Game over!");
    if(score > bestScore){
      bestScore = score;
    }
  }
  tailX+=speedTailRight; tailY+=speedTailDown; headX+=speedHeadRight; headY+=speedHeadDown;
  if(bendPoints[0] && tailX === bendPoints[0][0] && tailY === bendPoints[0][1]){ //tail reaches last bending point
    speedTailRight = bendPoints[0][2]; speedTailDown = bendPoints[0][3];
    bendPoints.shift();
  } 
}

var worm;
$("#newGame").on("click", function(){
  clearInterval(worm);
  initialize();
  worm = setInterval(function(){drawWorm(ctx)}, 10);
  if($("#pause").hasClass("paused")){
    $("#pause").removeClass("paused").attr("value", "Pause");
  }
});
$("#pause").on("click", function() {
  if(!$(this).hasClass("paused")){
    clearInterval(worm);
    $(this).addClass("paused").attr("value", "Resume");
  }else{
    worm = setInterval(function(){drawWorm(ctx)}, 10);
    $(this).removeClass("paused").attr("value", "Pause");
  }
});
