// "#232322"
let sSArr = [900, 1080, 1920, 1440, 2560, 1200, 1200]
let myWidth = sSArr[0]
let myHeight = sSArr[0]
let startValues = [myWidth, myHeight]

let pArr = []
let angle = 0
let speed = 0;

let tArr = [] // test Array

let valEle = 100
let valSec = 10
let valFac = 0
let valForm = 0
let valMode = 0

let color = [255, 233, 211, 255]
let alphaMap = 0

let linesBool = false
let pointsBool = false
let rectBool = false
let alphaBool = false

function preload() {
    //apache = loadModel('_assets/apacheH.obj');
    pinkArr = [
        loadImage('_assets/pinkGuy2-t.png'),
        loadImage('_assets/pinkGuy3-t.png'),
        loadImage('_assets/pinkGuy-t.png'),
    ]
}


function setup() {
    var myCan = createCanvas(myWidth, myHeight, WEBGL);
    frameRate(60);
    stroke(166);
    strokeWeight(1);
    background(0)
    angleMode(DEGREES)
    createEasyCam();
    //perspective(PI / 3.0, (width/height), 0.1, 2000)
    
// ELEMENTS
    createP("")
    sliderElements = createSlider(0, 200, 1, 1) // <------------------ ELEments
    sliderElements.position(0, myHeight+30)
    sliderElements.style('width', '100px')
    spanEle = createSpan("Width: ")
    spanEle.style('marginLeft', '10px')
    
// SECTORS
    sliderSect = createSlider(0, 500, 100, 1) // <------------------ SECTORS
    sliderSect.position(140, myHeight+30)
    sliderSect.style('width', '100px')
    spanSect = createSpan("Objects: ")
    spanSect.style('marginLeft', '100px')  
    
// FACTOR
    sliderFactor = createSlider(0, 200, 1.5, 0.5) // <------------------ FACTOR
    sliderFactor.position(280, myHeight+30)
    sliderFactor.style('width', '100px')
    spanFac = createSpan("Factor: ")
    spanFac.style('marginLeft', '70px')

    createP("<br><br>")
}

let px = 1
let py = 1
let pz = 1
let txtMap = 0

function draw() {
    valEle = sliderElements.value()
    valSec = sliderSect.value()
    valFac = sliderFactor.value()
    spanEle.elt.innerText = " Width: " + valEle
    spanSect.elt.innerText = "Objects: " + valSec
    spanFac.elt.innerText = "Factor: " + valFac
    pArr = []

    background(0)
    translate(0,0,0)
    
    rotateX(15)
    rotateY(180)
    rotateZ(15)

    rotateZ(speed)
    
    translate(0,0,30)
    pArr = cardoid3D(valEle, valSec, valFac)
    
    
    
    //stroke("#d3bf2b");
    fill("#d3bf2b");
    noFill()
    //beginShape(LINES)
    
    for (let i = 0; i < pArr.length; i++) {
        if (typeof pArr[i * valFac] !== 'undefined') {
            
            txtMap = map(i, 0,pArr.length, 0,2)
            texture(pinkArr[Math.ceil(txtMap)])
            
            translate(pArr[i][0],pArr[i][1],pArr[i][2])
            
            //plane(pArr[i][0],pArr[i * valFac][0])
            //plane(pArr[i][1],pArr[i * valFac][1])
            plane(pArr[i][2],pArr[i * valFac][2])
            plane(pArr[i * valFac][2],pArr[i][2])
                
            cone(10,100)
            box(50)
        }
    }
    //endShape(CLOSE);

    speed+=0.1
}

// END OF DRAMA

function cardoid3D(diameter, points, sections) {

    let sw = myWidth / 2 // positionierung
    let sh = myHeight / 2 // positionierung
    let radius = diameter / 2
    let pX = 0
    let pY = 0
    let angle = 360 / sections
    let rounds = 360 * points
    let moveZ = 0
    let pointArr = []
    
    for (let i = 0; i <= rounds; i += angle) {
        
        radius += 10
        
        pX = (radius * Math.sin(i))
        pY = (radius * Math.cos(i))
        pZ = moveZ += 1

        pointArr.push([pX, pY, pZ])
    }
    //console.log("c:",rounds, "a", angle);
    return pointArr
}
