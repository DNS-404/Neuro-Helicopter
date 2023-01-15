class Obstacle{
  constructor(x, y, wid, hei){
    this.width = wid;
    this.height = hei;
    this.x = x;
    this.y = y;
    this.speed = 5;
  }

  display(){
    fill(140, 255, 120);
    noStroke();
    rect(this.x, this.y, this.width, this.height, 2);
    stroke(132, 227, 111);
    for(let i=0; i<=this.height; i+=10){
      line(this.x+1, this.y + i, this.x + this.width-1, this.y + i);
    }
  }

  move(){
    this.x -= this.speed;
  }

  reachedEnd(){
    if(this.x + this.width <= 0){
      return true;
    }
    return false;
  }

  collision(h){
    let didCollide = false;
    if(h.y + h.height >= this.y && h.y <= this.y + this.height){
      if(h.x + h.width >= this.x && h.x <= this.x + this.width){
        didCollide = true;
      }
    }
    if(h.y + h.height >= height - wallWidth || h.y <= wallWidth){
      didCollide = true;
    }
    // helicopter needs to go through the wider space or else.. IT FCKING DIES
    // if(!didCollide && h.x + h.width >= this.x && h.x <= this.x + this.width){
    //   if(this.y >= height - this.y - this.height){ // go through upper space
    //     if(h.y > this.y + this.height){
    //       didCollide = true;
    //     }
    //   }else{ // go through lower space
    //     if(h.y < this.y){
    //       didCollide = true;
    //     }
    //   }
    // }
    return didCollide;
  }

}