class Mold{
    constructor(){
        this.x = random(width);
        this.y = random(height);
        this.r = d*0.5;

        this.heading = random(360);

        //turning polar coords into cartesian
        this.vx = cos(this.heading);
        this.vy = sin(this.heading);

        this.rotAngle = 45; //play with this for different searching rotations

        this.lSensorPos = createVector(0,0);
        this.cSensorPos = createVector(0,0);
        this.rSensorPos = createVector(0,0);
        this.sensorAngle = floor(random(25,50)); //tweak for more variety
        this.sensorDist =floor(random(10,50)); //tweak for more variety

        this.startled = false;
        this.startleTimer = 0;
        this.startleSpeed = 1;

        this.colNorm = color(190, 255, 245, 255);
        this.colScared = color(255, 140, 190, 255);
        this.fadeSpeed = 0.04; // tweak — smaller is a slower fade
        this.fadeAmount = 0;

    }

    startle() {
        // Wrapped distance
        let dx = abs(this.x - mouseX);
        dx = min(dx, width - dx);
        let dy = abs(this.y - mouseY);
        dy = min(dy, height - dy);
        let dst = sqrt(dx*dx + dy*dy);
    
        let maxDist = sqrt(width * width + height * height) / 5;
        let proximity = 1 - (dst / maxDist);
        proximity = constrain(proximity, 0, 1);
        proximity = pow(proximity, startleFalloff);
    
        if (proximity < 0.01) return;
    
        // Wrapped flee direction
        let fleeX = this.x - mouseX;
        let fleeY = this.y - mouseY;
        if (abs(fleeX) > width / 2)  fleeX -= Math.sign(fleeX) * width;
        if (abs(fleeY) > height / 2) fleeY -= Math.sign(fleeY) * height;
        this.heading = atan2(fleeY, fleeX);
    
        this.startled = true;
        this.startleTimer = floor(lerp(5, 50, proximity) * random(0.5, 1.5));
        this.startleSpeed = lerp(1, 2, proximity);
    }

    update(){

        this.vx = cos(this.heading);
        this.vy = sin(this.heading);
      
        // Use startleSpeed when startled, normal speed otherwise
        let speed = this.startled ? this.startleSpeed : 1;
        this.x = (this.x + this.vx * speed + width) % width;
        this.y = (this.y + this.vy * speed + height) % height;
      
        if (this.startled) {
            this.heading += random(-25, 25); // tweak this range for more/less wiggle when fleeing
            this.startleTimer--;
          if (this.startleTimer <= 0) {
            this.startled = false;
            this.startleSpeed = 1; // reset speed when recovering
          }
        } else {
            //normal behaviour
            this.getSensorPos(this.rSensorPos, this.heading + this.sensorAngle);  //right sensor position (+x, +y)
            this.getSensorPos(this.lSensorPos, this.heading - this.sensorAngle);  //left sensor position (-x, -y)
            this.getSensorPos(this.cSensorPos, this.heading);  //center sensor position (+0, +0)
            
            let index, lPx, rPx, cPx; 
            
            //getting pixel info from sensor positions and storing in variables lPx, rPx, cPx
            index = 4*(d*floor(this.rSensorPos.y)) * (d*width) + 4*(d*floor(this.rSensorPos.x));
            rPx = pixels[index];

            index = 4*(d*floor(this.lSensorPos.y)) * (d*width) + 4*(d*floor(this.lSensorPos.x));
            lPx = pixels[index];

            index = 4*(d*floor(this.cSensorPos.y)) * (d*width) + 4*(d*floor(this.cSensorPos.x));
            cPx = pixels[index];

            if (cPx > lPx && cPx > rPx){
                this.heading += 0;
            } else if (cPx < lPx && cPx < rPx){
                if(random(1) < 0.5){
                    this.heading += this.rotAngle;
                } else {
                    this.heading += -this.rotAngle;
                }
            } else if(lPx > rPx){
                this.heading += -this.rotAngle;
            } else if(rPx > lPx){
                this.heading += this.rotAngle;
            } 
        }
    }

    display() {
        // Fade toward scared or normal depending on state
        if (this.startled) {
            this.fadeAmount += this.fadeSpeed;
        } else {
            this.fadeAmount -= this.fadeSpeed;
        }
        this.fadeAmount = constrain(this.fadeAmount, 0, 1); // never go outside 0–1
    
        let currentColor = lerpColor(this.colNorm, this.colScared, this.fadeAmount);
    
        noStroke();
        fill(currentColor);
        circle(this.x, this.y, this.r * 2); //r*2 is normal, larger = testing
    }

    getSensorPos(sensor, angle){
        sensor.x = (this.x + this.sensorDist * cos(angle) + width) % width;
        sensor.y = (this.y + this.sensorDist * sin(angle) + height) % height;
    }

}