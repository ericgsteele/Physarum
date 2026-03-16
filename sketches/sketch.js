/// <reference types="p5/global" />


let molds = [];
let num = 4000;
let m;
let d;

function setup() {

  createCanvas(windowWidth,windowHeight);
  background(0);
  angleMode(DEGREES);
  d = pixelDensity();
  
  for (let i=0; i<num; i++){
    molds[i] = new Mold();
  }

  console.log("Sensor angle:" + molds[0].sensorAngle)
  console.log("Sensor distance: "+ molds[0].sensorDist);
}

function draw() { 
    background(0,5);


//TO DO: Figure out how to get this into a graphics buffer so the molds dont read it:
    // fill(255,205,240,200);
    // textSize(24);
    // textAlign(LEFT);
    // stroke(0);
    // strokeWeight(3);
    // textStyle(ITALIC);
    // text("Aren't they precious?", 50, 50);

    // textSize(14);
    // textAlign(RIGHT);
    // textStyle(NORMAL);
    // text("Sensor angle: "+ molds[0].sensorAngle, width-50, height-50);
    // text("Sensor distance: "+ molds[0].sensorDist, width-50, height-30);


    loadPixels();


    for (let i=0; i<num; i++){
      molds[i].update();
      molds[i].display();
    }
}



function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}