class Mold{
    constructor(){
        this.x = random(width);
        this.y = random(height);
        this.r = displayScale; // moldling size - minimum of 2

        this.heading = random(360);

        //turning polar coords into cartesian
        this.vx = cos(this.heading);
        this.vy = sin(this.heading);

        this.rotAngle = 45; //play with this for different searching rotations

        this.lSensorPos = createVector(0,0);
        this.cSensorPos = createVector(0,0);
        this.rSensorPos = createVector(0,0);
        this.sensorAngle = floor(random(25,90)); //tweak for more variety
        this.sensorDist = floor(random(20, 50)) * displayScale; //tweak for more variety

        this.startled = false;
        this.startleTimer = 0;
        this.startleSpeed = 1;

        this.currentColor = color(190, 255, 245, 255); // starts as normal color
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

    getLuminance(x, y) {
        let index = 4*(d*floor(y)) * (d*width) + 4*(d*floor(x));
        let r = pixels[index];
        let g = pixels[index + 1];
        let b = pixels[index + 2];
        return (r + g + b) / 3;
      }

    update(){

        this.vx = cos(this.heading);
        this.vy = sin(this.heading);

        let dt = deltaTime / 16.67; // normalize movement
      
        // Use startleSpeed when startled, normal speed otherwise
        let speed = (this.startled ? this.startleSpeed : 1) * dt;
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

            this.heading += random(-10, 10); // subtle drift — tweak the range
            //normal behaviour
            this.getSensorPos(this.rSensorPos, this.heading + this.sensorAngle);  //right sensor position (+x, +y)
            this.getSensorPos(this.lSensorPos, this.heading - this.sensorAngle);  //left sensor position (-x, -y)
            this.getSensorPos(this.cSensorPos, this.heading);  //center sensor position (+0, +0)
            
            let lPx, rPx, cPx; 
            
            this.sampleCooldown = 0; // boost performance by only sampling every other frame
            
            if (this.sampleCooldown <= 0) {
                rPx = this.getLuminance(this.rSensorPos.x, this.rSensorPos.y);
                lPx = this.getLuminance(this.lSensorPos.x, this.lSensorPos.y);
                cPx = this.getLuminance(this.cSensorPos.x, this.cSensorPos.y);
                this.sampleCooldown = 1; // skip next frame
            } else {
                this.sampleCooldown--;
              }   
            
            //threshold to fix mobile clustering - tweak higher or lower
            let threshold = 5;
                rPx = rPx < threshold ? 0 : rPx;
                lPx = lPx < threshold ? 0 : lPx;
                cPx = cPx < threshold ? 0 : cPx;

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
        let moving = false;
    
        if (this.startled) {
            this.fadeAmount += this.fadeSpeed;
            moving = true;
        } else if (this.fadeAmount > 0) {  // only fade back if not already at 0
            this.fadeAmount -= this.fadeSpeed;
            moving = true;
        }
    
        if (moving) {
            this.fadeAmount = constrain(this.fadeAmount, 0, 1);
            this.currentColor = lerpColor(this.colNorm, this.colScared, this.fadeAmount);
        }
        
            // Apply global fade-in to whatever color is current
            let a = min(alpha(this.currentColor), fadeIn);
            noStroke();
            fill(red(this.currentColor), green(this.currentColor), blue(this.currentColor), a);
        circle(this.x, this.y, this.r);
    }

    getSensorPos(sensor, angle){
        sensor.x = (this.x + this.sensorDist * cos(angle) + width) % width;
        sensor.y = (this.y + this.sensorDist * sin(angle) + height) % height;
    }

}