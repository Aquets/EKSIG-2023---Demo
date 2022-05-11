function preload(){
  // put preload code here
}

var gridPoints = [];
var selectedPoints = [];

function setup() {
  setAttributes('antialias', true);
  createCanvas(windowWidth,windowHeight, WEBGL)
  // put setup code here
  const step = 20;
  const distance = 20;

  translate(-windowWidth/2 + 20,-windowHeight/2 + 20)

  for (var i = -10; i < step - 10; i++) {
    for (var j = -10; j < step - 10; j++) {
      var point = new GridPoint(i*distance,j*distance);
      gridPoints.push(point);
    }
  }

  for (var i = 0; i < 5; i++) {
    var tempPoint = gridPoints[Math.floor(Math.random()*gridPoints.length)];
    var selected = {x: tempPoint.x, y: tempPoint.y, z: random(-100, +100)};
    selectedPoints.push(selected);
  }
}

function draw() {
  // put drawing code here
  background('#CCCCCC');

  strokeWeight(3);
  stroke("black");

  beginShape(POINTS);
  for (var i = 0; i < gridPoints.length; i++) {
    gridPoints[i].display();
  }
  endShape();


  strokeWeight(3);
  stroke("red");
  fill(255,0,0,20)
  // emissiveMaterial(255, 0, 0, 50)

  push();
  rotateY(frameCount/100);
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
	constructor(x,y){
    	this.x=x;
      this.y=y;
    }

    display(){
      vertex(this.x,this.y)
    }
}
