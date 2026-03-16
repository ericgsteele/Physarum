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
        this.sensorAngle = floor(random(25,90));
        this.sensorDist =floor(random(30,150));

    }

    update(){

        this.vx = cos(this.heading);
        this.vy = sin(this.heading);

        this.x = (this.x + this.vx + width) % width;
        this.y = (this.y + this.vy + height) % height;

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

    display(){
        
        noStroke();
        fill(190,255,245,255);
        circle(this.x, this.y, this.r*2)
        
        // //temp heading display
        // line(this.x, this.y, this.x + this.r * 3 * this.vx, this.y + this.r * 3 * this.vy);
        
        // //temp sensor display
        // fill(255,0,0);
        // rect(this.rSensorPos.x, this.rSensorPos.y, this.r, this.r);
        // rect(this.cSensorPos.x, this.cSensorPos.y, this.r, this.r);
        // rect(this.lSensorPos.x, this.lSensorPos.y, this.r, this.r);


    
    }

    getSensorPos(sensor, angle){
        sensor.x = (this.x + this.sensorDist * cos(angle) + width) % width;
        sensor.y = (this.y + this.sensorDist * sin(angle) + height) % height;
    }

}