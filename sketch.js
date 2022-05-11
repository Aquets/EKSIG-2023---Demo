function preload(){
  // put preload code here
}

var gridPoints = [];
var selectedPoints = [];

function setup() {
  setAttributes('antialias', true);
  frameRate(30)
  createCanvas(windowWidth,windowHeight, WEBGL)
  ortho()
  // put setup code here
  const step = 4;
  const distance = 80;

  translate(-windowWidth/2 + 20,-windowHeight/2 + 20)

  for (var i = -step/2; i < step/2; i++) {
    for (var j = -step/2; j < step/2; j++) {
      for (var k = -step/2; k < step/2; k++) {
        var point = new GridPoint(i*distance,j*distance,k*distance);
        gridPoints.push(point);
      }
    }
  }

  for (var i = 0; i < 10; i++) {
    var tempPoint = gridPoints[Math.floor(Math.random()*gridPoints.length)];
    selectedPoints.push(tempPoint);
  }
}

function draw() {
  // put drawing code here
  background('#CCCCCC');

  strokeWeight(8);
  stroke('#9F9F9F')
  orbitControl();

  push();
  // let locX = mouseX - width / 2;
  // let locY = mouseY - height / 2;
  // rotateX(-locY/1000);
  // rotateY(-locX/1000);

  beginShape(POINTS);
  for (var i = 0; i < gridPoints.length; i++) {
    gridPoints[i].display();
  }
  endShape();


  strokeWeight(3);
  stroke("white");
  fill(255,255,255,50)
  // emissiveMaterial(255, 0, 0, 50)

  for (var i = 0; i < selectedPoints.length; i++) {
    push()
    fill(255)
    noStroke()
    translate(selectedPoints[i].x, selectedPoints[i].y, selectedPoints[i].z)
    sphere(7)
    pop()
  }

  beginShape(TRIANGLE_STRIP);
  for (var i = 0; i < selectedPoints.length; i++) {
    vertex(selectedPoints[i].x, selectedPoints[i].y, selectedPoints[i].z)
  }
  endShape();
  pop();

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class GridPoint{
	constructor(x,y,z){
    	this.x=x;
      this.y=y;
      this.z=z;
    }

    display(){
      push();
      fill(150,150,150,100);
      noStroke()
      translate(this.x,this.y,this.z);
      sphere(5)
      pop()
    }
}
