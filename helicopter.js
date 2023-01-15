class Helicopter {
  constructor(brain){
    // and size
    this.x = width/6;
    this.y = height/2;
    this.height = 40;
    this.width = 80;
    // forces (frameRate: 20)
    // this.gravity = 4;
    // this.lift = -5;
    // forces
    this.gravity = 0.2;
    this.lift = -0.4;
    // velocity
    this.velocity = 0;
    this.speedLimit = 5;
    if(brain){
      this.brain = brain.copy();
    }else{
      this.brain = new NeuralNetwork(10, 12, 2);
    }
    

    this.distance = 0;
    this.fitness = 0;
  }

  think(){
    // find next obstacle
    let nextObstacle = null;
    let closestD = Infinity;
    for(let i=0; i<obstacles.length; i++){
      let d = obstacles[i].x + obstacles[i].width - this.x;
      if(d < closestD && d > 0){
        nextObstacle = obstacles[i];
        closestD = d;
      }
    }

    // find closest wall to obstacle
    let upperMaxHeight = 0, lowerMaxHeight = 0;
    for(let i=0; i<upperWalls.length; i++){
      if((upperWalls[i].x >= nextObstacle.x && upperWalls[i].x < nextObstacle.x + nextObstacle.width) || (lowerWalls[i].x >= nextObstacle.x && lowerWalls[i].x < nextObstacle.x + nextObstacle.width)){
        // upper walls
        if(upperWalls[i].height > upperMaxHeight) upperMaxHeight = upperWalls[i].height;
        let prevIndex = i;
        for(let k=0; k<2; k++){
          --prevIndex;
          if(prevIndex < 0) prevIndex = upperWalls.length-1;
          if(upperWalls[prevIndex].height > upperMaxHeight) upperMaxHeight = upperWalls[prevIndex].height;
        }
        let nextIndex = i;
        for(let k=0; k<2; k++){
          ++nextIndex;
          if(nextIndex >= upperWalls.length-1) nextIndex = 0;
          if(upperWalls[nextIndex].height > upperMaxHeight) upperMaxHeight = upperWalls[nextIndex].height;
        }

        // lower walls
        if(lowerWalls[i].height > lowerMaxHeight) lowerMaxHeight = lowerWalls[i].height;
        prevIndex = i;
        for(let k=0; k<2; k++){
          --prevIndex;
          if(prevIndex < 0) prevIndex = lowerWalls.length-1;
          if(lowerWalls[prevIndex].height > lowerMaxHeight) lowerMaxHeight = lowerWalls[prevIndex].height;
        }
        nextIndex = i;
        for(let k=0; k<2; k++){
          ++nextIndex;
          if(nextIndex >= lowerWalls.length-1) nextIndex = 0;
          if(lowerWalls[nextIndex].height > lowerMaxHeight) lowerMaxHeight = lowerWalls[nextIndex].height;
        }

        break;
      }
    }
    let upperSpacingObs = nextObstacle.y - upperMaxHeight;
    let lowerSpacingObs = height - nextObstacle.y - nextObstacle.height - lowerMaxHeight;
    if(upperSpacingObs < 0) upperSpacingObs = 0;
    if(lowerSpacingObs < 0) lowerSpacingObs = 0;
    if(upperSpacingObs >= lowerSpacingObs){
      upperSpacingObs = height;
      lowerSpacingObs = 0;
    }else{
      upperSpacingObs = 0;
      lowerSpacingObs = height;
    }

    // find closest wall to helicopter
    upperMaxHeight = 0; lowerMaxHeight = 0;
    let upperMaxHeight2 = 0, lowerMaxHeight2 = 0;
    let upperMaxHeight3 = 0, lowerMaxHeight3 = 0;
    for(let i=0; i<upperWalls.length; i++){
      if((upperWalls[i].x >= this.x && upperWalls[i].x < this.x + this.width) || (lowerWalls[i].x >= this.x && lowerWalls[i].x < this.x + this.width)){
        // upper walls
        if(upperWalls[i].height > upperMaxHeight) upperMaxHeight = upperWalls[i].height;
        let prevIndex = (i==0) ? (upperWalls.length-1) : (i-1);
        if(upperWalls[prevIndex].height > upperMaxHeight) upperMaxHeight = upperWalls[prevIndex].height;
        
        let nextIndex = (i==upperWalls.length-1) ? 0 : (i+1);
        if(upperWalls[nextIndex].height > upperMaxHeight)
          upperMaxHeight = upperWalls[nextIndex].height;
        nextIndex = (nextIndex==upperWalls.length-1) ? 0 : (nextIndex+1);
        if(upperWalls[nextIndex].height > upperMaxHeight)
          upperMaxHeight = upperWalls[nextIndex].height;


        // lower walls
        if(lowerWalls[i].height > lowerMaxHeight) lowerMaxHeight = lowerWalls[i].height;
        prevIndex = (i==0) ? (lowerWalls.length-1) : (i-1);
        if(lowerWalls[prevIndex].height > lowerMaxHeight) lowerMaxHeight = lowerWalls[prevIndex].height;
        nextIndex = (i==lowerWalls.length-1) ? 0 : (i+1);
        if(lowerWalls[nextIndex].height > lowerMaxHeight)
          lowerMaxHeight = lowerWalls[nextIndex].height;
        nextIndex = (nextIndex==lowerWalls.length-1) ? 0 : (nextIndex+1);
        if(lowerWalls[nextIndex].height > lowerMaxHeight)
          lowerMaxHeight = lowerWalls[nextIndex].height;

        break;
      }
    }
    // for(let i=0; i<obstacles.length; i++){ // if helicopter is above or below any obstacle, CONSIDER IT AS WALL
    //   if(this.x + this.width >= obstacles[i].x && this.x <= obstacles[i].x + obstacles[i].width){
    //     // heli is above
    //     if(this.y + this.height < obstacles[i].y){
    //       if(height - obstacles[i].y > lowerMaxHeight)
    //         lowerMaxHeight = height - obstacles[i].y;
    //     }else if(this.y > obstacles[i].y + obstacles[i].height){ // heli is below
    //       if(obstacles[i].y + obstacles[i].height > upperMaxHeight)
    //         upperMaxHeight = obstacles[i].y + obstacles[i].height;
    //     }
    //   }
    // }
    let upperSpacingHeli = this.y - upperMaxHeight;
    let lowerSpacingHeli = height - this.y - this.height - lowerMaxHeight;
    let upperSpacingHeli2 = this.y - upperMaxHeight2;
    let lowerSpacingHeli2 = height - this.y - this.height - lowerMaxHeight2;
    let upperSpacingHeli3 = this.y - upperMaxHeight3;
    let lowerSpacingHeli3 = height - this.y - this.height - lowerMaxHeight3;
    if(upperSpacingHeli < 0) upperSpacingHeli = 0;
    if(lowerSpacingHeli < 0) lowerSpacingHeli = 0;
    if(upperSpacingHeli2 < 0) upperSpacingHeli2 = 0;
    if(lowerSpacingHeli2 < 0) lowerSpacingHeli2 = 0;
    if(upperSpacingHeli3 < 0) upperSpacingHeli3 = 0;
    if(lowerSpacingHeli3 < 0) lowerSpacingHeli3 = 0;
    // find closest wall to helicopter
    /*
    0. distance to the next obstacle
    1. top position of next obstacle
    2. bottom position of next obstacle
    3. distance to the closest wall top of obstacle
    4. distance to the closest wall below obstacle
    5. vertical velocity of helicopter
    6. vertical upper position of helicopter
    7. vertical lower position of helicopter
    8. distance to the closest wall top of helicopter
    9. distance to the closest wall bottom of helicopter
    //8. distance to the next closest wall top of helicopter
    //9. distance to the next to next closest wall top of helicopter
    //11. distance to the next closest wall bottom of helicopter
    //12. distance to the next to next closest wall bottom of helicopter
    */
    let inputs = [];
    inputs[0] = (nextObstacle.x - this.x - this.width) / width;
    inputs[1] = nextObstacle.y / height;
    inputs[2] = (nextObstacle.y + nextObstacle.height) / height;
    inputs[3] = upperSpacingObs / height;
    inputs[4] = lowerSpacingObs / height;
    inputs[5] = this.velocity / this.speedLimit;
    inputs[6] = this.y / height;
    inputs[7] = (this.y + this.height) / height;
    inputs[8] = upperSpacingHeli / height;
    inputs[9] = lowerSpacingHeli / height;
    // if(random(1) < 0.001){
    //   console.log(inputs);
    //   noLoop();
    // }
    let output = this.brain.predict(inputs);
    // console.log(output);
    // if(random(1) < 0.01){
    //   console.log(inputs);
    // }
    if(output[0] > output[1]){
      this.takeOff();
    }
  }

  mutate(){
    this.brain.mutate(0.1);
  }

  update(){
    this.distance++;
    
    this.velocity += this.gravity;
    this.y += this.velocity;

    // limit max descent speed
    if(this.velocity > this.speedLimit) this.velocity = this.speedLimit;
    // (if frameRate = 20)-> if(this.velocity > 5) this.velocity = 5;

    if(this.y > height - 50 - this.height){
      this.y = height - 50 - this.height;
      this.velocity = 0;
    }
    if(this.y <= 50){
      this.y = 50;
      this.velocity = 0;
    }
  }

  display(){
    fill(151);
    noStroke();
    image(img1, this.x, this.y, this.width, this.height);
    // if(counter >= 0 && counter < 10){
    //   image(img1, this.x, this.y, this.width, this.height);
    // }else if(counter >= 10 && counter < 20){
    //   image(img2, this.x, this.y, this.width, this.height);
    // }else if(counter >= 20 && counter < 30){
    //   image(img4, this.x, this.y, this.width, this.height);
    // }else if(counter >= 30 && counter < 40){
    //   image(img5, this.x, this.y, this.width, this.height);
    // }else if(counter >= 40){
    //   image(img6, this.x, this.y, this.width, this.height);
    // }
  }

  takeOff(){
    if(this.velocity > 2) this.velocity = 2;
    this.velocity += this.lift;
    // limit max up speed
    if(this.velocity < -5) this.velocity = -5;
    // (if frameRate = 20)-> if(this.velocity < -10) this.velocity = -10;
  }


}