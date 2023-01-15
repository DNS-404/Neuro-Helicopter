let helicopters = [];
let diedHeli = [];
let obstacles = [];
let upperWalls = [];
let lowerWalls = [];
let lastHeight;

/* ----- CONSTANTS ------- */
const obsHeight = 100;
const obsWidth = 40;
const wallsObs = 50; // MUST BE DIVISIBLE BY WINDOW WIDTH
const wallWidth = 80; // Upper and lower width
// const wallWidth = 120; // Upper and lower width

let fontDigital;
let counter = 0;
let img1, img2, img3, img4, img5, img6;
let bestHeli = null;

/* ------- AI --------- */
const totalPopulation = 2000;
let bestDistance = 0;
let generation = 0;
let controlAI;
let overallBest = 0;

let squeezing = true;

function setup(){
  // Setting up
  createCanvas(750, 600);
  fontDigital = loadFont('./font/digital-7.ttf');
  img1 = loadImage('./photos/heli1.png');
  // img2 = loadImage('./photos/heli2.png');
  // img3 = loadImage('./photos/heli3.png');
  // img4 = loadImage('./photos/heli4.png');
  // img5 = loadImage('./photos/heli5.png');
  // img6 = loadImage('./photos/heli6.png');

  controlAI = createSlider(1, 100, 1);

  // create helicopter
  for(let i=0; i<totalPopulation; i++){
    helicopters[i] = new Helicopter();
  }

  // create obstacles
  obstacles = [];
  obstacles.push(new Obstacle(width, random(100, height - 200), obsWidth, obsHeight));
  obstacles.push(new Obstacle(width + 3*(width/4), random(100, height - 200), obsWidth, obsHeight));

  // wall obstacles
  upperWalls = [];
  lowerWalls = [];
  lastHeight = 10;
  for(let x=0; x<=width+2*wallWidth; x+=wallsObs){
    upperWalls.push(new Obstacle(x, 0, wallsObs, wallWidth));
    lowerWalls.push(new Obstacle(x, height - wallWidth, wallsObs, wallWidth));
  }
}

function draw(){
  background(0);
  /* --------- upper part and below part ------------- */
  // borders
  // fill(140, 255, 120);
  // rect(0, 0, width+1, wallWidth+1);
  // rect(0, height-wallWidth, width+1, wallWidth+1);
  // stroke(132, 227, 111);
  // for(let i=10; i<=wallWidth; i+=10){
  //   line(0, i, width, i);
  //   line(0, height - i, width, height - i);
  // }


  for(let k=0; k<controlAI.value(); k++){

  /* -------------- Wall Obstacles --------------------- */
  for(let i=0; i<upperWalls.length; i++){
    if(upperWalls[i].reachedEnd()){
      let heightChange = (bestDistance > 2000) ? random(-20, 20) : random(-10, 10);
      if(random(1) < 0.05){
        if(random(1) < 0.5) heightChange += random(60, 80);
        else heightChange += random(-80, -60);
      }
      let newHeight = lastHeight + heightChange;
      // constraining
      newHeight = constrainIt(newHeight);
      if(i==0){
        upperWalls[i] = new Obstacle(upperWalls[upperWalls.length-1].x + wallsObs, 0, wallsObs, wallWidth + newHeight);
        lowerWalls[i] = new Obstacle(lowerWalls[lowerWalls.length-1].x + wallsObs, height - wallWidth + newHeight, wallsObs, wallWidth - newHeight);
      }else{
        upperWalls[i] = new Obstacle(upperWalls[i-1].x + wallsObs, 0, wallsObs, wallWidth + newHeight);
        lowerWalls[i] = new Obstacle(lowerWalls[i-1].x + wallsObs, height - wallWidth + newHeight, wallsObs, wallWidth - newHeight);
      }
      lastHeight = newHeight;
    }
    for(let j=helicopters.length-1; j>=0; j--){
      if(upperWalls[i].collision(helicopters[j]) || lowerWalls[i].collision(helicopters[j])){
        diedHeli.push(helicopters.splice(j,1)[0]);
        // console.log(helicopters.length);
      }
    }
    upperWalls[i].move();
    lowerWalls[i].move();
  }
  

  /* --------------- Obstacles logic ------------------ */
  for(let i=0; i<obstacles.length; i++){
    obstacles[i].move();
    if(obstacles[i].reachedEnd()){
      obstacles[i] = new Obstacle(obstacles[i^1].x + 3*(width/4), random(100, height - 200), obsWidth, obsHeight);
    }
    for(let j=helicopters.length-1; j>=0; j--){
      if(obstacles[i].collision(helicopters[j])){
        diedHeli.push(helicopters.splice(j,1)[0]);
        // console.log(helicopters.length);
      }
    }
  }

  for(let j=0; j<helicopters.length; j++){
    helicopters[j].think();
    helicopters[j].update();
  }

  /* ------------- New generation ------------- */
  if(helicopters.length == 0){
    nextGeneration();
    generation++;
  }

  // Calc best distance
  for(let i=0; i<helicopters.length; i++){
    if(helicopters[i].distance > bestDistance){
      bestDistance = helicopters[i].distance;
    }
  }

  // console.log("HERE");

}


  /* ---------- controls ------------- */
  // if(keyIsDown(32)){
  //   helicopters[0].takeOff();
  // }

  /* ------------- displaying ---------------- */
  for(let i=0; i<obstacles.length; i++){
    obstacles[i].display();
  }
  for(let i=0; i<upperWalls.length; i++){
    upperWalls[i].display();
  }
  for(let i=0; i<lowerWalls.length; i++){
    lowerWalls[i].display();
  }
  // bestHeli = null;
  // for(let i=0; i<helicopters.length; i++){
  //   if(bestHeli == null || bestHeli.distance < helicopters[i].distance){
  //     bestHeli = helicopters[i];
  //   }
  // }
  // if(helicopters.length > 0) helicopters[0].display();
  for(let i=0; i<helicopters.length; i++){
    helicopters[i].display();
  }

  /* ----------- Bottom info --------------- */
  fill(0);
  textSize(32);
  textFont(fontDigital);
  text("DISTANCE: " + bestDistance, 15, height - 15);
  text("GENERATION: " + generation, 15, 40);
  text("HELICOPTERS: " + helicopters.length, width-250, 40);
  text("BEST DISTANCE: " + overallBest, width-300, height-15);

  /* ---------- extra ------------ */
  ++counter;
  if(counter > 50) counter = 0;
}

function constrainIt(h){
  if(bestDistance > 2000){
    if(h < -150){ // above
      h = -150;
    }
    if(h > 150){ // below
      h = 150;
    }
  }else{
    if(h < -120){ // above
      h = -120;
    }
    if(h > 120){
      h = 120;
    }
  }
  if(wallWidth + h < 0){
    h = (-1*wallWidth) + 2;
  }else if(wallWidth - h < 0){
    h = wallWidth-2;
  }
  return h;
}

