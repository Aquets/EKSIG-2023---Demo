let inconsolata;

function preload(){
  inconsolata = loadFont('assets/Inconsolata-VariableFont_wdth,wght.ttf');
}

var gridPoints = [];
var grid = [];
var selectedPoints = [];
var center = {x: 0, y: 0, z:0};

const step = 8;
const distance = 80;
const nPoint = 8;

var pointer;

var state = 1

function setup() {
  setAttributes('antialias', true);
  frameRate(30)
  createCanvas(windowWidth,windowHeight, WEBGL)
  ortho(-width/2, width/2, -height/2, height/2, -3000, +3000)
  textFont(inconsolata);
  textSize(32);
  // put setup code here

  button1 = createButton('state 1');
  button1.position(0, 0);
  button1.mousePressed(function() {
    frameCount = 0;
    state = 1;
  });

  button2 = createButton('state 2');
  button2.position(100, 0);
  button2.mousePressed(function() {
    frameCount = 0;
    state = 2;
  });

  button3 = createButton('state 3');
  button3.position(200, 0);
  button3.mousePressed(function() {
    frameCount = 0;
    state = 3;
  });

  button4 = createButton('state 4');
  button4.position(300, 0);
  button4.mousePressed(function() {
    frameCount = 0;
    state = 4;
  });

  pointer = new Point(0,0)

  translate(-windowWidth/2,-windowHeight/2)

  for (var i = -step/2; i <= step/2; i++) {
    for (var j = -step/2; j <= step/2; j++) {
      var time = i+j+step;
      var g = new GridPoint(j*distance, i*distance, 0, time);
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
  fill('black')
  text(frameCount, -width/2+20, -height/2 +50)
  text("state: " + state, -width/2+20, -height/2 +100)

  let locX = mouseX - width / 2;
  let locY = mouseY - height / 2;

  if (frameCount == 1) {
      pointer.x = 0;
      pointer.y = 0;
  }

  pointer.update(locX, locY);

  orbitControl();
  // beginShape(POINTS);
  // for (var i = 0; i < grid.length; i++) {
  //   push()
  //   translate(0,0,-4*80)
  //
  //   grid[i].display();
  //
  //   pop()
  // }
  // endShape();
  if (state == 1) {
    anim1_grid();
  }else if (state == 2) {
    anim2_points();
  }else if (state == 3) {
    anim3_lines();
  }else if (state == 4) {
    anim4_3d();
  }else {




  strokeWeight(3);
  stroke("white");
  fill(255,255,255,50);
  noFill()
  noStroke()
  // emissiveMaterial(255, 0, 0, 50)


  if (keyIsPressed === true) {
    push()
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

}

//_______________________________________________ ANIMATION STATES

//_______________________________________________ [1]

function anim1_grid() {
  for (var i = 0; i < grid.length; i++) {
    // var opacity = frameCount*20 - grid[i].time*50 - 200
    var opacity = frameCount*20 - i*20 - 200
    // if (opacity < 150) {
    //   opacity = 0;
    // }else {
    //   opacity = 255
    // }
    fill(150,150,150,opacity);
    noStroke();

    grid[i].display();
  }
  if (frameCount > 1.5*grid.length) {
    frameCount = 0;
    state = 2;
  }
}

//_______________________________________________ [2]

function anim2_points() {
  for (var i = 0; i < grid.length; i++) {
    fill(150);
    noStroke();
    grid[i].display();
  }

  for (var i = 0; i < selectedPoints.length; i++) {
    var opacity = frameCount*15 - i*100;
    var size = map(opacity, 0,150,0,15,true)

    if (opacity < 0) {
      opacity = 0;
    }
    fill(255, 255, 255, 255)
    ellipse(selectedPoints[i].x, selectedPoints[i].y, size)
  }

  if (frameCount > 70) {
    frameCount = 0;
    state = 3;
  }

}

//_______________________________________________ [3]

function anim3_lines() {
  for (var i = 0; i < grid.length; i++) {
    fill(150);
    noStroke();
    grid[i].display();
  }

  for (var i = 0; i < selectedPoints.length; i++) {
    fill(255)
    noStroke();
    ellipse(selectedPoints[i].x, selectedPoints[i].y, 15)

    var x1 = selectedPoints[i].x;
    var y1 = selectedPoints[i].y;

    if (i != selectedPoints.length-1) {
      var x2 = selectedPoints[i+1].x;
      var y2 = selectedPoints[i+1].y;
    }else {
      var x2 = selectedPoints[0].x;
      var y2 = selectedPoints[0].y;
    }
    var m = (y2 - y1) / (x2 - x1);
    var q = (x2*y1 - x1*y2) / (x2 - x1);

    var pos = frameCount*15 - i*10 - 200;
    var distMax = sqrt( sq(x2-x1) + sq(y2-y1) );

    var dist = map(pos, 0, 255, 0, distMax, true) + 1;

    if (m == Infinity || m == -Infinity) {
      posX = x1;
      posY = y1 + (Math.sign(y2-y1)) * dist;
    }else {
      posX = ((2*x1 + 2*m*y1 - 2*m*q) + (Math.sign(x2-x1)) * sqrt(sq(-2*x1 - 2*m*y1 + 2*m*q) - 4*(1 + sq(m))*(sq(x1) + sq(q) + sq(y1) -2*q*y1 - sq(dist)))) / (2*(1 + sq(m)))
      posY = posX*m + q;
    }

    stroke(255);
    strokeWeight(3)
    line(x1, y1, posX, posY)
  }
  if (frameCount > 70) {
    frameCount = 0;
    state = 4;
  }

}

//_______________________________________________ [4]

function anim4_3d() {
  for (var i = 0; i < grid.length; i++) {
    fill(150);
    noStroke();
    push()
    translate(0,0,-step/2*distance)
    grid[i].display();
    pop();
  }

  push()
  let locX = mouseX - width / 2;
  let locY = mouseY - height / 2;
  rotateX(frameCount/500);
  rotateY(frameCount/500);

  rotateX(pointer.y/2000)
  rotateY(-pointer.x/2000)

  for (var i = 0; i < selectedPoints.length; i++) {
    fill(255)
    noStroke();

    push()
    translate(selectedPoints[i].x, selectedPoints[i].y, selectedPoints[i].z)
    sphere(8)
    pop()

    var x1 = selectedPoints[i].x;
    var y1 = selectedPoints[i].y;
    var z1 = selectedPoints[i].z;

    if (i != selectedPoints.length-1) {
      var x2 = selectedPoints[i+1].x;
      var y2 = selectedPoints[i+1].y;
      var z2 = selectedPoints[i+1].z;
    }else {
      var x2 = selectedPoints[0].x;
      var y2 = selectedPoints[0].y;
      var z2 = selectedPoints[0].z;
    }

    stroke(255);
    strokeWeight(3)
    line(x1, y1, z1, x2, y2, z2)
  }

  noStroke()
  beginShape(TRIANGLE_STRIP)
  var opacity = frameCount*20 - 200
  opacity = map(opacity,0,500,0,80,true)
  emissiveMaterial(255,255,255, 100)
  for (var i = 0; i < selectedPoints.length; i++) {
    vertex(selectedPoints[i].x, selectedPoints[i].y, selectedPoints[i].z)
  }
  endShape(CLOSE)

  pop()
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  ortho(-width/2, width/2, -height/2, height/2, -3000, +3000)
}

class GridPoint{
	constructor(x, y, z, time){
    	this.x=x;
      this.y=y;
      this.z=z;
      // this.time =  Math.round( random(0,step*2) );
      this.time = time;
    }

    display(){
      ellipse(this.x, this.y, 10)
    }
}

function makeShape() {
  selectedPoints = []
  // for (var i = 0; i < nPoint; i++) {
  //   var tempPoint = gridPoints[Math.floor(Math.random()*gridPoints.length)];
  //   selectedPoints.push(tempPoint);
  // }
  var seedX = random(0,100)
  var seedY = random(0,100)
  var seedZ = random(0,100)
  noiseSeed(seedY)
  for (var i = 0; i <= step; i++) {
    noiseSeed(seedY)
    var x = noise(i);
    noiseSeed(seedZ)
    var y = noise(i);
    noiseSeed(seedZ)
    var z = noise(i);

    x = Math.round(map(x,0,1,-step/2,step/2,true)) * distance
    y = Math.round(map(y,0,1,-step/2,step/2,true)) * distance
    z = Math.round(map(z,0,1,-step/2,step/2,true)) * distance

    var tempPoint = {x: x, y: y, z: z}
    selectedPoints.push(tempPoint);
  }
  console.log(selectedPoints);
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

///////////////////////////////////////////////////////////////////// POINT CLASS

function Point(_x, _y) {
  this.x = _x;
  this.y = _y;
  this.speed = 1;
  this.directionX = 1;
  this.directionY = 1;

  this.noiseSeed = random();
  this.noise;
  this.s = random();
  this.n;

  this.update = function(_targetX, _targetY) {

    this.noise = 50 * noise(millis() / 10000 + this.noiseSeed);
    this.n = 3 * noise(millis() / 10000 + this.s);

    this.x = this.x + cos(this.noise / 3) * 2 * this.n
    this.y = this.y + sin(this.noise / 3) * 2 * this.n

    var deltaX = this.x - _targetX;
    var deltaY = this.y - _targetY;

    if (deltaX >= 0) {
      this.directionX = -1;
    } else {
      this.directionX = 1;
    }
    if (deltaY >= 0) {
      this.directionY = -1;
    } else {
      this.directionY = 1;
    }
    this.x = this.x + (this.speed * this.directionX * abs(deltaX) / 20);
    this.y = this.y + (this.speed * this.directionY * abs(deltaY) / 20);
  }

  this.display = function() {
    noStroke();
    fill(255, 255, 255, 20)
    ellipse(this.x, this.y, 30)
    ellipse(this.x, this.y, 20)
    ellipse(this.x, this.y, 10)
    ellipse(this.x, this.y, 9)
    ellipse(this.x, this.y, 7)
    ellipse(this.x, this.y, 6)
    ellipse(this.x, this.y, 5)
    fill(255, 255, 255)
    ellipse(this.x, this.y, 5)
  }
}
