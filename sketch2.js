function preload(){
  // put preload code here
}

var gridPoints = [];
var grid = [];
var selectedPoints = [];
var center = {x: 0, y: 0, z:0};

const step = 8;
const distance = 80;

function setup() {
  setAttributes('antialias', true);
  frameRate(30)
  createCanvas(windowWidth,windowHeight, WEBGL)
  ortho()
  // put setup code here

  translate(-windowWidth/2,-windowHeight/2)

  for (var i = -step/2; i <= step/2; i++) {
    for (var j = -step/2; j <= step/2; j++) {
      var time = Math.round( random(0,step*2) ); // i+j+step
      var g = new GridPoint(i*distance, j*distance, 0, time);
      grid.push(g)
      for (var k = -step/2; k <= step/2; k++) {
        var point = new GridPoint(i*distance, j*distance, k*distance, i+j);
        gridPoints.push(point);
      }
    }
  }

  makeShape();
}

function draw() {
  // put drawing code here
  background('#CCCCCC');

  strokeWeight(8);
  stroke('#9F9F9F')

  //orbitControl();
  beginShape(POINTS);
  for (var i = 0; i < grid.length; i++) {
    push()
    translate(0,0,-4*80)

    grid[i].display();

    pop()
  }
  endShape();


  strokeWeight(3);
  stroke("white");
  fill(255,255,255,50);
  noFill()
  noStroke()
  // emissiveMaterial(255, 0, 0, 50)


  if (keyIsPressed === true) {
    push()
    let locX = mouseX - width / 2;
    let locY = mouseY - height / 2;
    rotateX(-locY/500);
    rotateY(-locX/500)
  }



  for (var i = 0; i < selectedPoints.length; i++) {
    push()
    var opacity = frameCount*15 - i*100 - (step*100)

    if (opacity < 0) {
      opacity = 0;
    }
    fill(255, 255, 255, opacity)
    stroke(`rgba(255,255,255,${opacity/255})`);
    if (i != selectedPoints.length-1) {
      line(selectedPoints[i].x, selectedPoints[i].y, selectedPoints[i].z, selectedPoints[i+1].x, selectedPoints[i+1].y, selectedPoints[i+1].z)
    }
    noStroke()
    translate(selectedPoints[i].x, selectedPoints[i].y, selectedPoints[i].z)
    sphere(7)
    pop()
  }

  beginShape(TESS);
  for (var i = 0; i < selectedPoints.length; i++) {
    vertex(selectedPoints[i].x, selectedPoints[i].y, selectedPoints[i].z)
  }
  endShape();
  push()
  translate(-center.x, -center.y, -center.z)
  pop();

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  ortho()
}

class GridPoint{
	constructor(x, y, z, time){
    	this.x=x;
      this.y=y;
      this.z=z;
      this.time = time
    }

    display(){
      var opacity = frameCount*20 - this.time*50 - 200
      fill(150,150,150,opacity);
      noStroke()
      ellipse(this.x, this.y, 10)
    }
}

function makeShape() {
  selectedPoints = []
  for (var i = 0; i < 10; i++) {
    var tempPoint = gridPoints[Math.floor(Math.random()*gridPoints.length)];
    selectedPoints.push(tempPoint);
  }

  center = findCenter(selectedPoints)
}

function mouseClicked() {
  frameCount = 0;
  makeShape();
}

function findCenter(points){

  var xValues = [];
  var yValues = [];
  var zValues = [];

  for (var i = 0; i < points.length; i++) {
    var tempX = points[i].x;
    var tempY = points[i].y;
    var tempZ = points[i].z;

    xValues.push(points[i].x);
    yValues.push(points[i].y);
    zValues.push(points[i].z);
  }

  var centerX = (findMin(xValues) + findMax(xValues)) / 2;
  var centerY = (findMin(yValues) + findMax(yValues)) / 2;
  var centerZ = (findMin(zValues) + findMax(zValues)) / 2;

  var center = {x: centerX, y: centerY, z: centerZ};

  return center
}

function findMin(values){

  var min = 0;

  for (var i = 0; i < values.length; i++) {
    temp = values[i];
    if (temp < min) {
      min = temp;
    }
  }

  return min
}

function findMax(values){

  var max = 0;

  for (var i = 0; i < values.length; i++) {
    temp = values[i];
    if (temp > max) {
      max = temp;
    }
  }

  return max
}
