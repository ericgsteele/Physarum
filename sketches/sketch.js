/// <reference types="p5/global" />
let d;
let displayScale;

let fadeIn = 0;        // current opacity, starts at 0
let fadeInSpeed = 2; // tweak — smaller is a slower fade in

let molds = [];
let num; 

let startleFalloff = 5; // tweak this as see fit

function setup() {
  d = pixelDensity();
  displayScale = max(d, 2);
  createCanvas(windowWidth,windowHeight);
  background(0);
  angleMode(DEGREES);

  num = floor((width * height) / 300); // number of moldlings based on screen size - tweak divisor as needed
  
  for (let i=0; i<num; i++){
    molds[i] = new Mold();
  }
}

function draw() { 
    background(0,5);

    fadeIn = min(fadeIn + fadeInSpeed, 255);

    loadPixels();

    for (let i=0; i<num; i++){
      molds[i].update();
      molds[i].display();
    }
    
    fill(255,205,240,200);
    strokeWeight(3);
    stroke(0);

    textSize(10*displayScale);
    
    textStyle(NORMAL);

    textAlign(LEFT);
    text("Moldlings: "+ num, 50, height-45*displayScale);

    textAlign(LEFT);
    text("Sensor angle: "+ molds[0].sensorAngle, 50, height-15*displayScale);
    
    textAlign(LEFT);
    text("Sensor distance: "+ molds[0].sensorDist, 50, height-30*displayScale);

    


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