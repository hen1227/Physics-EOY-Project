// global constants 

const SNAP_DISTANCE = 30;


//
let startingBattery, resistor1, resistor2;
let resistorButt, capacitorButt, inductorButt, wireButt;
let mainCircuit;

// Called once at the start
function setup() {
    // p5.js setup function
    
    
    let canvas = createCanvas(window.innerWidth, window.innerWidth/8*6);
    canvas.parent("#canvas");
    rectMode(CORNERS);
    frameRate(24);

    resistorButt = select("#CreateResistorButton");
    resistorButt.mousePressed(createResistorClicked);

    capacitorButt = select("#CreateCapacitorButton");
    capacitorButt.mousePressed(createCapacitorClicked);

    inductorButt = select("#CreateInductorButton");
    inductorButt.mousePressed(createInductorClicked);
    
    wireButt = select("#CreateWireButton");
    wireButt.mousePressed(createWireClicked);



    // Create the circuit
    mainCircuit = new Circuit();

    // Create and connect circuit elements
    let battery = new Battery(10, 0, createVector(300, 120), createVector(320, 320));
    // Add elements to the circuit
    mainCircuit.addElement(battery);


}

// Called Every frame
function draw(){
    background(245);

     // Solve the circuit
     mainCircuit.solve();


     mainCircuit.render();

     if(newElement != null){
        // newElement.startPoint = createVector(mouseX, mouseY);
        newElement.setEndPoint(createVector(mouseX, mouseY));
        newElement.renderElement();
     }
}


let newElement;

function mousePressed(){
    if(newElement == null) return;
    if(mouseX > width || mouseX < 0 || mouseY < 0  || mouseY > height) return;
    newElement.setStartPoint(createVector(mouseX, mouseY));
    
}

function mouseDragged(){
    if(newElement == null) return;
    newElement.setEndPoint(createVector(mouseX, mouseY));
}  

function mouseReleased(){
    if(mouseX > width || mouseX < 0 || mouseY < 0  || mouseY > height) return;
    if(newElement == null) return;

    mainCircuit.addElement(newElement);
    mainCircuit.makeConnections(null);

    newElement = null;
}

function createResistorClicked(){
    print("Resistor Button Clicked");

    newElement = new Resistor(10, createVector(mouseX, mouseY), createVector(mouseX + 50, mouseY + 50));
}

function createCapacitorClicked(){
    print("Capacitor Button Clicked");
}

function createInductorClicked(){
    print("Inductor Button Clicked");
}

function createWireClicked(){
    print("Wire Button Clicked");
}
