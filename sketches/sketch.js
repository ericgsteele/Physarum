/// <reference types="p5/global" />


let molds = [];
let num = 3500; //number of moldlings

let startleFalloff = 5; // tweak this as see fit

function setup() {
  pixelDensity(1);

  createCanvas(windowWidth,windowHeight);
  background(0);
  angleMode(DEGREES);
  
  for (let i=0; i<num; i++){
    molds[i] = new Mold();
  }
}

function draw() { 
    background(0,5);

    loadPixels();

    for (let i=0; i<num; i++){
      molds[i].update();
      molds[i].display();
    }
    
    fill(255,205,240,200);
    strokeWeight(3);
    stroke(0);

    textSize(10);
    
    textStyle(NORMAL);

    textAlign(LEFT);
    text("Sensor angle: "+ molds[0].sensorAngle, 50, height-10);
    
    textAlign(LEFT);
    text("Sensor distance: "+ molds[0].sensorDist, 50, height-30);

}

function mousePressed() {
  for (let i = 0; i < num; i++) {
    molds[i].startle();
  }
}

function mouseDragged() {
  for (let i = 0; i < num; i++) {
    molds[i].startle();
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}