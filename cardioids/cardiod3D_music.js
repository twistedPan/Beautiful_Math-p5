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

let ckForChange = []

function preload() {
    pinkArr = [
        loadImage('../_assets/pinkGuy2-t.png'),
        loadImage('../_assets/pinkGuy3-t.png'),
        loadImage('../_assets/pinkGuy-t.png'),
    ]
}


function setup() {
    var myCan = createCanvas(myWidth, myHeight, WEBGL);
    myCan.mousePressed(userStartAudio);
    fft = new p5.FFT();
    mic = new p5.AudioIn();
    mic.start();
    
    frameRate(60);
    stroke(166);
    strokeWeight(1);
    background(0)
    angleMode(DEGREES)
    //perspective(PI / 3.0, (width/height), 0.1, 2000)
    
// ELEMENTS
    createP("")
    sliderElements = createSlider(0, 200, 1, 1) // <------------------ ELEments
    sliderElements.position(0, myHeight+30)
    sliderElements.style('width', '100px')
    spanEle = createSpan("Width: ")
    spanEle.style('marginLeft', '10px')
    
// SECTORS
    sliderSect = createSlider(4, 500, 27, 1) // <------------------ SECTORS
    sliderSect.position(140, myHeight+30)
    sliderSect.style('width', '100px')
    spanSect = createSpan("Objects: ")
    spanSect.style('marginLeft', '100px')  
    
// FACTOR
    sliderFactor = createSlider(0, 200, 20, 0.5) // <------------------ FACTOR
    sliderFactor.position(280, myHeight+30)
    sliderFactor.style('width', '100px')
    spanFac = createSpan("Factor: ")
    spanFac.style('marginLeft', '70px')

// MODE
    sMode = createSlider(0, 1, 0, 1) // <------------------ MODE
    sMode.position(0, myHeight+80)
    sMode.style('width', '100px')
}

let px = 1
let py = 1
let pz = 1
let txtMap = 0
let micMapHigh = 0
function draw() {
    background(0)
    translate(0,0,0)
    
    valEle = sliderElements.value()
    valSec = sliderSect.value()
    valFac = sliderFactor.value()
    //valSec = 11
    //valFac = 15
    valMode = sMode.value()
    if (deltaTime >= 100) valMode = 0
    
    spanEle.elt.innerText = " Width: " + valEle
    spanSect.elt.innerText = "Objects: " + valSec
    spanFac.elt.innerText = "Sectors: " + valFac
    
    //let spectrum = fft.analyze();
    //let waveform = fft.waveform();
    micLevel = mic.getLevel();
    let micMap = map(micLevel, 0,0.5, 0,600)
    if (frameCount % 10 == 0) micMapHigh = map(micLevel*10000, 20,250, 0,5000)
    
    valEle = micMap
    //background(micMap)
    console.log("Mic Input:",micMapHigh);
    
    rotateX(15)
    rotateY(160)
    rotateZ(15)
    rotateX(sin(micLevel*10000)*25)
    rotateY(cos(micLevel*10000)*25)
    rotateX(sin(speed*40)*30)
    rotateY(cos(speed*40)*30)

    rotateZ(speed)
    
    translate(0,-200,(micMapHigh)+400)
    //translate(0,0,)
    
    //if(!ckForChange.includes(valEle) || !ckForChange.includes(valSec) || !ckForChange.includes(valFac)) {
        pArr = cardoid3D(valEle, valSec, valFac ,5, valMode)
    //}
    
    //ckForChange = [valEle,valSec,valFac]
    
    
    stroke(255);
    strokeWeight(1)
    //stroke("#d3bf2b");
    noStroke()
    noFill()
 
    //createWhirl(pArr,10,10,600,100)
    //createWhirl(pArr,-1020,0,1000,100)
    //createWhirl(pArr,1020,-1000,500)
    //createWhirl(pArr,2020,-2000,800)
    
    
    
 
    push()
    fill("rgb(211, 43, 43)");
    beginShape(TESS)
    let count = 0
    for (let i = 0; i < pArr.length; i++) {
        if (typeof pArr[i * valFac] !== 'undefined') {
            vertex(pArr[i][0],pArr[i][1],pArr[i][2])
            //count++
        }
    }
    //vertex(10,10,0)
    endShape(CLOSE);
    pop()
    //console.log(":",count);

    
    
/*  
    push()
    pArr = cardoid3D(valEle, valSec, valFac ,1, valMode)
    for (let i = 0; i < pArr.length; i++) {
        if (typeof pArr[i * valFac] !== 'undefined') {
            
            txtMap = map(i, 0,pArr.length, 0,2)
            texture(pinkArr[Math.ceil(txtMap)])
            
            translate(pArr[i][0],pArr[i][1],pArr[i][2])

            cone(10,100)
            box(50)
        }
    }
    pop()
*/   
    
    speed+=0.1
    //noLoop()
}

// END OF DRAMA
/*
vertex(pArr[i][0],pArr[i * valFac][0])
vertex(pArr[i][1],pArr[i * valFac][1])
vertex(pArr[i][2],pArr[i * valFac][2])

vertex(pArr[i][0],pArr[i][1],pArr[i][2])

plane(pArr[i][0],pArr[i * valFac][0])
plane(pArr[i][1],pArr[i * valFac][1])
plane(pArr[i][2],pArr[i * valFac][2])
plane(pArr[i * valFac][2],pArr[i][2])               
*/

function cardoid3D(diameter, points, sections, mover, mode) {

    let radius = diameter / 2
    let angle = 360 / sections
    let rounds = 360 * points
    let kreisBogen = ((rounds/360) * Math.PI) * (sections/360)
    let moveZ = 0
    let incrementer = 0
    let pointArr = []

    if (mode == 0) incrementer = kreisBogen
    else incrementer = angle
        
    for (let i = 0; i <= rounds; i += incrementer) {
        
        radius += 5
        
        pX = (radius * Math.sin(i))
        pY = (radius * Math.cos(i))
        pZ = moveZ += mover

        //if (i%2==0)a1.push([pX, pY, pZ])
        //else a2.push([pX, pY, pZ])
        
        pointArr.push([pX, pY, pZ])
    }
    //console.log("c:",rounds, "a", angle, "ks", kreisBogen);
    return pointArr
}


/*
    POINTS, LINES, TRIANGLES, TRIANGLE_FAN, TRIANGLE_STRIP, QUADS, QUAD_STRIP, and TESS
*/
function createWhirl(arr,x,y,z,moveR) {
    translate(x,y,z)
    beginShape(TESS)
    for (let i = 0; i < arr.length; i++) {
        vertex(arr[i][0],arr[i][1],arr[i][2])
    }
    endShape(CLOSE);
    //pop()
}


function maxA( array ){
    return Math.max.apply( Math, array );
};