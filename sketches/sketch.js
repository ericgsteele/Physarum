/// <reference types="p5/global" />


let molds = [];
let num = 4000;
let m;
let d;
let pg; // <-- graphics buffer for text overlay

function setup() {

  createCanvas(windowWidth,windowHeight);
  background(0);
  angleMode(DEGREES);
  d = pixelDensity();

  pg = createGraphics(windowWidth,windowHeight);
  pg.angleMode(DEGREES);
  
  for (let i=0; i<num; i++){
    molds[i] = new Mold();
  }

  console.log("Sensor angle:" + molds[0].sensorAngle)
  console.log("Sensor distance: "+ molds[0].sensorDist);
}

function draw() { 
    background(0,5);


    pg.clear();//clear each frame so molds dont read em
    pg.fill(255,205,240,200);
    pg.strokeWeight(3*d);
    pg.stroke(0);
    strokeCap(ROUND);

    pg.textSize(10*d);
    
    pg.textStyle(NORMAL);

    pg.textAlign(LEFT);
    pg.text("Sensor angle: "+ molds[0].sensorAngle, 50, height-10*d);
    
    pg.textAlign(CENTER);
    pg.text("Sensor distance: "+ molds[0].sensorDist, width/2, height-10*d);
    
    pg.textAlign(RIGHT);
    pg.text("Moldling size: "+ molds[0].r, width-50, height-10*d);


    loadPixels();


    for (let i=0; i<num; i++){
      molds[i].update();
      molds[i].display();
    }

    image(pg,0,0); //composite the text image buffer on top

}



function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  pg.resizeCanvas(windowWidth, windowHeight);
}