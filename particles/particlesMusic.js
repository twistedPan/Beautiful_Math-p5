//"rgb(32, 141, 115)"
/* NEXT
    Points lerp in Position from A to B

*/
const cSize = {w: 900, h: 720}
const format = (cSize.w + cSize.h) / 3

class Vector {
    constructor(x, y) {
        this.x = x || 0
        this.y = y || 0
    }
    getDirection() {
        return Math.atan2(this.y, this.x)
    }
    getMagnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    add(v2) {
        return new Vector(this.x + v2.x, this.y + v2.y);
    }
    subtract(v2) {
        return new Vector(this.x - v2.x, this.y - v2.y);
    }
    multiply(scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    }
    divide(scalar) {
        return new Vector(this.x / scalar, this.y / scalar);
    }
    dotProduct(v2) {
        return this.x * v2.x + this.y * v2.y;
    }
    normalize() {
        return new Vector(this.x / (Math.sqrt(this.x * this.x + this.y * this.y)),
            this.y / (Math.sqrt(this.x * this.x + this.y * this.y)));
    }
}

class Particle {
    constructor(x, y, r) {
        this.x = x
        this.y = y
        this.radius = r || 1
        this.spread = {
            x: randomRNG(-66, 66),
            y: randomRNG(-66, 66)
        }
        this.color = 0
        this.eleNr = particleNr++
    }

    update(newX, newY, spreader) {

        this.x = newX + this.spread.x
        this.y = newY + this.spread.y

        this.spread.x += randomRNG(-spreader,spreader)
        this.spread.y += randomRNG(-spreader,spreader)
    }

    display(type, size) {
        //console.log(":",this.x,this.y,this.radius)
        if (type == "fill") fill(this.color)
        else stroke(this.color)

        if (size) this.radius = size
        rect (this.x, this.y, this.radius * 2)

        //if (this.eleNr > particlesCount/2) erase()
        //else noErase()
    }
    coloring(c1, c2, c3, a) {
        this.color = color(c1, c2, c3, a)
    }

    reset(particlesCount) {
        particles = []
        for (let i = 0; i < particlesCount; i++) {
            let rngPoint = rngCoords(0, 7)
            particles[i] = new Particle(-100, -100)
            //particles[i] = new Particle(rngPoint.x, rngPoint.y)
            //particles[i] = new Particle(width / 2 + rngPoint.x,height / 2 + rngPoint.y,3)
        }
    }
}

let particles = []
let particlesCount = 7
let particleNr = 0
let fac1 = 10
let speed = 0
let rngColor = getRandomColor()
//let targetP = new Vector(rngCoords(format).x,rngCoords(format).y)
let cubicX = 0
let cubicStep = 0.002
let pPs = []

let bgC = "rgba(19, 19, 24, 1)"
let xoff = 0
let yoff = 0
let rX = 0
let rY = 0
let translateX = 0

let forBool = false
let randomBool = false

let colorMode
let sliderR
let sliderG
let sliderB
let sliderSizeLine
let sliderMode

var valR = 255
var valG = 200
var valB = 165
var valSize = 2
var valSum = 7
var valSpread = 0
var valMode = 0

let col1 = 0
let col2 = 0
let col3 = 0
let track = []
function preload() {
    soundFormats('mp3', 'ogg')
    track = [
        loadSound('../_assets/sound/FormatB-IsaacNewtonWasWrong'),
        loadSound('../_assets/sound/Chief-thosewerethedays'),
        loadSound('../_assets/sound/Vantage-50__50'),
        loadSound('../_assets/sound/LÜNE-Absences'),
        loadSound('../_assets/sound/Voyage-Dynamic'),
    ]
}
let averageAmp = 0
let trackIndex = 2
let maxBass = maxMid = maxTreble = 0
//==============================================================================
//  ------------------------------- SETUP --------------------------------------
//==============================================================================
function setup() {
    var myCan = createCanvas(cSize.w, cSize.h)
    canvas = myCan.canvas
    frameRate(60)
    background(bgC)
    stroke("rgba(113, 58, 55, 0)")
    strokeWeight(2)
    fft = new p5.FFT();
    track[trackIndex].setVolume(1);

    for (let i = 0; i < particlesCount; i++) {
        let rngPoint = rngCoords(1, 7)
        particles[i] = new Particle(-10, -10, 10)
    }

    pPs = [
        new Vector(particles[0].x, particles[0].y),
        new Vector(rngCoords(66).x, rngCoords(66).y),
        new Vector(rngCoords(66).x, rngCoords(66).y),
        new Vector(rngCoords(66).x, rngCoords(66).y),
    ]

// HTML ELEMENTS -----------------------------------------------------------
{
    createP("")
    resetBtn = createButton("Reset Background")
    resetBtn.elt.style.marginLeft = "10px"
    resetBtn.mousePressed(resetBG)

    resetLinesBtn = createButton("Reset Lines")
    resetLinesBtn.elt.style.marginLeft = "10px"
    resetLinesBtn.mousePressed(resetLines)

    // Size Slider
    sliderSizeLine = createSlider(0.3, 20, 2, 0.1)
    sliderSizeLine.position(220, height + 15)
    sliderSizeLine.style('width', '100px')
    spanSize = createSpan("Size:")
    spanSize.style('marginLeft', '40px')

    // Sum Slider
    sliderSum = createSlider(1, 100, 7, 1)
    sliderSum.position(340, height + 15)
    sliderSum.style('width', '100px')
    spanSum = createSpan("Sum:")
    spanSum.style('marginLeft', '70px')

    // Spreader Slider
    sliderSpread = createSlider(0, 20, 0, 1)
    sliderSpread.position(460, height + 15)
    sliderSpread.style('width', '100px')
    spanSpread = createSpan("Sum:")
    spanSpread.style('marginLeft', '70px')

    checkboxMode = createCheckbox('Draw Mode', false)
    checkboxMode.elt.style.margin = "0px"
    checkboxInflate = createCheckbox('Inflate', false)
    checkboxInflate.elt.style.marginBottom = "5px"

    // Color Mode
    sliderMode = createSlider(0, 2, 0, 1)
    sliderMode.position(0, height + 83)
    sliderMode.style('width', '30px')

    colorMode = createDiv('Color Mode Stuff')
    colorMode.elt.style.marginLeft = "63px"
    createP('<br>')

    // Color Sliders / Spans
    sliderR = createSlider(0, 255, 255, 1)
    sliderR.position(10, height + 140)
    sliderR.style('width', '80px')

    sliderG = createSlider(0, 255, 200, 1)
    sliderG.position(100, height + 140)
    sliderG.style('width', '80px')

    sliderB = createSlider(0, 255, 165, 1)
    sliderB.position(190, height + 140)
    sliderB.style('width', '80px')

    spanR = createSpan("Red")
    spanR.elt.style.marginLeft = "40px"
    spanG = createSpan("Green")
    spanG.elt.style.marginLeft = "30px"
    spanB = createSpan("Blue")
    spanB.elt.style.marginLeft = "25px"

    createP("")
    for (e of document.getElementsByTagName("Input")) {
        e.style.margin = "10px 15px"
    }

    colorPicker = createColorPicker("rgb(28, 28, 36)");
    colorPicker.position(cSize.w-300, cSize.h + 10);
    colorPicker.style('width', '60px');
}
}

//==============================================================================
//  ------------------------------- DRAW ---------------------------------------
//==============================================================================
function draw() {
    //background("rgba(28, 28, 36, 1)")
    noFill()
// HTML Values
{
    valR = sliderR.value()
    spanR.elt.innerText = "Red " + valR
    valG = sliderG.value()
    spanG.elt.innerText = "Green " + valG
    valB = sliderB.value()
    spanB.elt.innerText = "Blue " + valB

    //valSize = sliderSizeLine.value()
    spanSize.elt.innerText = "Size: " + int(valSize*100)/100

    valSum = sliderSum.value()
    spanSum.elt.innerText = "Sum: " + valSum
    particlesCount = valSum

    valSpread = sliderSpread.value()
    spanSpread.elt.innerText = "Spread: " + valSpread

    valMode = sliderMode.value()
    colorMode.elt.innerText = "Color Mode: " + valMode +
        " ===> 0=Sliders Dynamic / 1=Mouse / 2=Sliders Static"

    forBool = checkboxMode.child()[0].checked
    // Inflating
    if (checkboxInflate.child()[0].checked) valSize += Math.sin(speed) * 10

    let mXMap = map(mouseX, 0, width, 255, 0)
    let mYMap = map(mouseY, 0, height, 0, 255)

    switch (valMode) {
        case 1:
            col1 = mXMap
            col2 = mYMap
            col3 = valB
            break
        case 2:
            col1 = int(valR)
            col2 = int(valG)
            col3 = int(valB)
            break
        case 0:
            col1 = int(Math.abs(Math.sin(speed) * valR))
            col2 = int(Math.abs(Math.cos(speed) * valG))
            col3 = int(Math.abs(Math.tan(speed) * valB))
            break
    }
}
    let spectrum = fft.analyze()
    let waveform = fft.waveform()
    let treble = fft.getEnergy( "treble" )
    let mid = fft.getEnergy( "mid" )
    let bass = fft.getEnergy( "bass" )
    if (bass > maxBass) maxBass = bass
    if (mid > maxMid) maxMid = mid
    if (treble > maxTreble) maxTreble = treble

    for (let i=0;i<spectrum.length;i++){
        averageAmp += spectrum[i]
    }
    averageAmp = averageAmp / spectrum.length

    let trebleMap = map(treble, 0,255, 1,10) // speed
    let midMap = map(mid, 0,255, 0,4)   // spread
    let bassMap = map(bass, 200,255, 1,6) | 1 // size


    //Random actions  ----------------------------------------------------------
    if (Math.random() < 0.01 || randomBool) {
        randomBool = true
        valSize = jumpBetween(valSize,2,10,0.1)
    }

    // PARTICLES ---------------------------------------------------------------
    let cbV = cubic_interpolate(pPs[0], pPs[1], pPs[2], pPs[3], cubicX)
    //translate(-translateX, 0)
    translate(cbV.x, cbV.y)

    if (cubicX >= 1) {
        cubicX = 0
        pPs.shift() + pPs.push(new Vector(rngCoords(66).x, rngCoords(66).y)) // first to last
    }

    particles.forEach(e =>
        e.coloring(col1/2, col2, col3, 155) +
        e.display("fill", bassMap) +
        e.update(0,0,midMap)
    )

    if (forBool)
        if (frameCount % 4 == 0) {
            background("rgba(28, 28, 36, 0.005)")
            particles.forEach(e => e.reset(bassMap))
        }

    cubicStep = treble/5000
    cubicX += cubicStep
    speed += 0.01
    translateX += 1


    fill(bgC)
    //rect(width-100,height-10,100,-255)
    push()
        fill(int(col1/1.5), col2, Math.round(mid))
    rect(-120, -10, 10,-bass/2)
        fill(int(col1/2),   col2, Math.round(mid))
    rect(-40, 0,    10,-mid/2)
        fill(int(col1/3),   col2/3, Math.round(mid))
    rect(20, 10,    10,-treble/2)
    pop()
/*
    noStroke();
    fill("rgba(186, 235, 20, 1)");
    for (let i = 0; i< spectrum.length; i++){
        let x = map(i, 0, spectrum.length, 0, width);
        let h = -height + map(spectrum[i], 0, 255, height, 0);
        rect(x, height, width / spectrum.length, h )
    }
    noFill();
    beginShape();
    stroke(255,0,0);
    for (let i = 0; i < waveform.length; i++){
        let x = map(i, 0, waveform.length, 0, width);
        let y = map( waveform[i], -1, 1, 0, height);
        vertex(x,y);
    }
    endShape();
    pop()
*/

    //console.log("currentTime:",track[trackIndex].currentTime(), track[trackIndex].duration())
    //console.log("Map B:",bassMap, "Map M:",midMap, "Map T:",trebleMap)
    //console.log("Max B:",maxBass,"Max M:",maxMid,"Max T:",maxTreble)
    //console.log("Parts:",r2N(bass),"_",r2N(mid),"_", r2N(treble))
    //console.log("getBPM():",)

    //noLoop()
} // END OF DRAMA





//==============================================================================
//  ------------------------------- FUNCTIONS ----------------------------------
//==============================================================================

function mouseClicked() {
    let click = new Vector(mouseX,mouseY)
    console.log(click.x,":",click.y)
    if (click.x < width && click.y < height) {
        pPs.splice(4,0,click)
        if (click.x < width/10 && click.y < height/10) saveCanvas('myCanvas', 'png');
        if (!track[trackIndex].isPlaying()) track[trackIndex].play()
    }
}

function checkModeEvent() {
    if (this.checked()) {
        forBool = true
    } else {
        forBool = false
    }
}

function resetBG() {
    clear()
    background(colorPicker.color())
}

function resetLines() {
    particles.forEach(e => e.reset(particlesCount))
}

let klickBool = false
function jumpBetween(value,start,end,step) {
    start = start || 1
    step = step || 0.1
    end = end || 1
    //value = constrain(value,start,end)
    //console.log(value,start, end, step, klickBool)
    if (value < start) {
        klickBool = true
        randomBool = false
    } else if (value > end) {
        klickBool = false
    }
    if (klickBool) {
        return value += step
    } else {
        return value -= step
    }
}

function rngCoords(space, spread, rng) { // return new vector()
    let x = space || 0
    let y = space || 0
    spread = spread || 1

    if (rng == "noise") {
        //console.log("noise ON")
        rX = randomRNG(0.0001, 0.005)
        rY = randomRNG(0.0001, 0.005)

        xoff = xoff + rX
        yoff = yoff + rY
        nX = noise(xoff) * space
        nY = noise(yoff) * space

    } else if (spread > 1) {
        //console.log("spread ON")
        nX = randomRNG(space + (spread * getOne(-1, 1)), cSize.w - space + (spread * getOne(-1, 1)))
        nY = randomRNG(space + (spread * getOne(-1, 1)), cSize.h - space + (spread * getOne(-1, 1)))
    } else {
        //console.log("all OFF")
        nX = randomRNG(space, cSize.w - space)
        nY = randomRNG(space, cSize.h - space)
    }

    x += Math.floor(nX)
    y += Math.floor(nY)

    //console.log("nx:",nX, "rx:",nY)
    //console.log(x,":",y)

    return new Vector(x, y)
}

function randomPoint(margin) {
    return randomRNG(margin, cSize.h - margin)
}


function cubic_interpolate(v0, v1, v2, v3, x) {
    let P = (v3.subtract(v2)).subtract((v0.subtract(v1))) // (v3 - v2) - (v0 - v1)
    let Q = (v0.subtract(v1)).subtract(P) // (v0 - v1) - P
    let R = v2.subtract(v0) //  v2 -v0
    let S = v1

    P = P.multiply(Math.pow(x, 3))
    Q = Q.multiply(Math.pow(x, 2))
    R = R.multiply(x)

    return P.add(Q.add(R.add(S))) //P*Math.pow(x,3) + Q*Math.pow(x,2) + R*x + S
}
//console.log(":",cubic_interpolate(new Vector(2,4),new Vector(2,6),new Vector(6,3),new Vector(8,9),0.3))



// Random Color
function getRandomColor() {
    var letters = '0123456789ABCDEF'
    var color = '#'
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}

function getOne(a, b) {
    arr = [a, b]
    return arr[Math.round(Math.random())]
}

function randomRNG(min, max) {
    return Math.random() * (max - min) + min
}

function r2N(v) {
    return (Math.round(v*100))/100
}
