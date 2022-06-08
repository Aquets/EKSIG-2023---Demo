let theShader;

function preload(){

theShader = loadShader('shaders/onecolor.vert', 'shaders/onecolor.frag');

}

function setup() {

createCanvas(windowWidth, windowHeight, WEBGL);

noStroke();

}

function draw() {
  let yMouse = map(mouseY, 0, height, height, 0) / height;
  let xMouse = mouseX/width;

  theShader.setUniform("u_resolution", [width, height]);
  theShader.setUniform("u_mouse", [xMouse, yMouse]);
  theShader.setUniform('u_time', frameCount * 0.01);

  shader(theShader);

  rect(0,0,200,200);

}

function windowResized(){

  resizeCanvas(windowWidth, windowHeight);

}
