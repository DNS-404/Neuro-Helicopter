function nextGeneration(){
  // calc fitness
	calculateFitness();
  for(let i=0; i<totalPopulation; i++){
    helicopters[i] = pickRandom();
  }
  // start again (copied from setup function)
  diedHeli = [];
  bestDistance = 0;
  obstacles = [];
  obstacles.push(new Obstacle(width, random(100, height - 200), obsWidth, obsHeight));
  obstacles.push(new Obstacle(width + (width/2), random(100, height - 200), obsWidth, obsHeight));
  upperWalls = [];
  lowerWalls = [];
  lastHeight = 10;
  for(let x=0; x<=width+2*wallWidth; x+=wallsObs){
    upperWalls.push(new Obstacle(x, 0, wallsObs, wallWidth));
    lowerWalls.push(new Obstacle(x, height - wallWidth, wallsObs, wallWidth));
  }
}

function pickRandom(){
  let index = 0;
  let r = random(1);
  while(r > 0){
    r = r - diedHeli[index].fitness;
    index++;
  }
  index--;

  let heli = diedHeli[index];
  let child = new Helicopter(heli.brain);
  child.mutate();
  return child;
}

function calculateFitness(){
  let totalScore = 0;
  let bestFitness = 0;
  for(let i=0; i<diedHeli.length; i++){
    totalScore += diedHeli[i].distance;
  }
  for(let i=0; i<diedHeli.length; i++){
    diedHeli[i].fitness = diedHeli[i].distance / totalScore;
    if(diedHeli[i].distance > bestFitness)
      bestFitness = diedHeli[i].distance;
  }
  if(bestFitness > overallBest) overallBest = bestFitness;
}
