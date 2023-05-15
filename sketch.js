
let startingBattery;

// Called once at the start
function setup(){
    createCanvas(400, 400);
    background(240);

    startingBattery = new Battery(12, 0.1, createVector(100, 150), createVector(100, 175));
}

// Called Every frame
function draw(){
    
    startingBattery.updateCurrent();
    startingBattery.renderElement();
}

// Built in p5 function
function mousePressed(){
    // Add new wire from battery to mouse position
    startingBattery.positiveConnections.push(new Wire(startingBattery.endPoint, createVector(mouseX, mouseY)));
}