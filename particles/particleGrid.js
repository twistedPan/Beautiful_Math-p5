//"rgb(32, 141, 115)"
class Particle {
    constructor(x, y, r) {
        this.x = x
        this.y = y
        this.radius = r
        this.speed = random(-1, 3)
        this.color = 0
        this.changeTime = (lineFB * 2) * cellWidth
        this.rand_x = random(1)
        this.rand_y = random(1)
        this.direction = [1,-1]
    }

    update(fc,mode) {

        if (fc % this.changeTime == 0 || fc == 1) {
            this.rand_x = this.direction[Math.round(random(0,1))]
            this.rand_y = this.direction[Math.round(random(0,1))]
        }

        let nX = this.rand_x
        let nY = this.rand_y

        //console.log("Nx:",nX, "Ny",nY)

        this.x += nX
        this.y += nY

        //this.x = constrain(this.x, 0, width)
        //this.y = constrain(this.y, 0, height)

        //this.radius = this.rand_x
        //console.log("x:",this.x, "y",this.y)
    }

    display(type, size) {
        if (type == "fill") fill(this.color)
        else stroke(this.color)

        if (size) this.radius = size

        circle(this.x, this.y, this.radius * 2)
    }

    coloring(c1, c2, c3, a) {
        this.color = color(c1, c2, c3, a)
    }

    reset(particlesCount) {
        particles = []
        for (let i = 0; i < particlesCount; i++) {
            let x = getAorB(-cellWidth*lineFB,cellWidth*lineFB)
            let y = getAorB(-cellWidth*lineFB,cellWidth*lineFB)
        particles[i] = new Particle(width / 2 + x,
                                    height / 2 + y,
                                    3)
        }
    }
}


let particles = []
let particlesCount = 100
let fac1 = 20
let cellWidth = 0.5 //Math.ceil(Math.random()*50)/10
let lineFB = 60
let speed = 0
let rngColor = getRandomColor()
console.log(":",cellWidth)
let forBool

let checkMode = "flow"
let colorMode
let sliderR
let sliderG
let sliderB
let sliderSizeLine

let sliderMode


let col1 = 0
let col2 = 0
let col3 = 0

let displayControls = true
let valMode = 0
let valSize = 2

let currentFrameCount = 0
let blowUp = false

//===============================================================================
//  ------------------------------- SETUP ---------------------------------
//===============================================================================
function setup() {
    var myCan = createCanvas(900, 720)
    canvas = myCan.canvas
    frameRate(60)
    background("rgb(27, 27, 24)")
    stroke(0)
    strokeWeight(3)

    for (let i = 0; i < particlesCount; i++) {
        particles[i] = new Particle(width / 2 + (getAorB(-cellWidth*lineFB,cellWidth*lineFB)),
                                    height / 2 + (getAorB(-cellWidth*lineFB,cellWidth*lineFB)),
                                    3)
    }

    //particles.forEach(e => console.log(":",e.x))

// HTML ELEMENTS ----------------------------------------------------------------------
    if (displayControls){
        createP("")
        resetBtn = createButton("Reset Background")
        resetBtn.elt.style.marginLeft = "10px"
        resetBtn.mousePressed(resetBG)

        resetLinesBtn = createButton("Reset Lines")
        resetLinesBtn.elt.style.marginLeft = "10px"
        resetLinesBtn.mousePressed(resetLines)

    // Size Slider
        sliderSizeLine = createSlider(0.3, 20, 2, 0.01)
        sliderSizeLine.position(220, height+15)
        sliderSizeLine.style('width', '100px')
        spanSize = createSpan("Size:")
        spanSize.style('marginLeft', '40px')

    // Sum Slider
        sliderSum = createSlider(1, 100, 20, 1)
        sliderSum.position(340, height+15)
        sliderSum.style('width', '100px')
        spanSum = createSpan("Sum:")
        spanSum.style('marginLeft', '80px')

        checkboxMode = createCheckbox('Draw Mode', false)
        checkboxMode.elt.style.marginBottom = "5px"

    // Color Mode
        sliderMode = createSlider(0, 2, 1,1)
        sliderMode.position(-5, height+49)
        sliderMode.style('width', '30px')

        colorMode = createDiv('Color Mode Stuff')
        colorMode.elt.style.marginLeft = "63px"
        createP('<br>')

    // Color Sliders / Spans
        sliderR = createSlider(0, 255, 200,1)
        sliderR.position(10, height+110)
        sliderR.style('width', '80px')

        sliderG = createSlider(0, 255, 100,1)
        sliderG.position(100, height+110)
        sliderG.style('width', '80px')

        sliderB = createSlider(0, 255, 100,1)
        sliderB.position(190, height+110)
        sliderB.style('width', '80px')

        spanR = createSpan("Red")
        spanR.elt.style.marginLeft = "40px"
        spanG = createSpan("Green")
        spanG.elt.style.marginLeft = "30px"
        spanB = createSpan("Blue")
        spanB.elt.style.marginLeft = "25px"


    // Time Span
    }
        spanTimeInS = createP("")
        spanTimeInS.elt.style.marginLeft = "20px"
        for ( e of document.getElementsByTagName("Input")) {e.style.margin = "10px 15px"}
}

//===============================================================================
//  ------------------------------- DRAW ---------------------------------
//===============================================================================
function draw() {
    //fill(255)
    noFill()
    if (displayControls) {
        var valR = sliderR.value()
        spanR.elt.innerText = "Red " + valR
        var valG = sliderG.value()
        spanG.elt.innerText = "Green " + valG
        var valB = sliderB.value()
        spanB.elt.innerText = "Blue " + valB

        valSize = sliderSizeLine.value()
        spanSize.elt.innerText = "Size: " + valSize

        var valSum = sliderSum.value()
        spanSum.elt.innerText = "Sum: " + valSum
        particlesCount = valSum

        valMode = sliderMode.value()
        colorMode.elt.innerText = valMode + " Color Mode - 0=Time (s) / 1=Mouse / 2=Sliders"

        checkMode = checkboxMode.child()[0].checked

    }

    let s = second()
    let timeMap1 = map(s*2, 0, 120, 125, 255)
    let timeMap2 = map(s*2, 0, 120, 255, 0)
    let timeMap3 = map(s*2, 0, 120, 0, 255)

    let mXMap = map(mouseX, 0, width, 255, 0)
    let mYMap = map(mouseY, 0, height, 0, 255)

    switch(valMode) {
        case 1:
            col1 = mXMap
            col2 = mYMap
            col3 = valB
            break
        case 2:
            col1 = valR
            col2 = valG
            col3 = valB
            break
        case 0:
            col1 = timeMap1
            col2 = timeMap2
            col3 = timeMap3
            break
    }


    // PARTICLES ------------------
    //background("rgba(28, 28, 36, 0.01)")


    if (Math.random < 0.1) {
        currentFrameCount = frameCount
        blowUp = true
    }
    if (blowUp) {
        //while(currentFrameCount) {}
    }
    //console.log(":",frameCount)




    if (forBool) {
        background("rgba(255, 255, 255, 0.001)")
        for (let i = 0; i < 100; i++) {
            particles.forEach(e =>
                e.coloring(col1, col2, col3, 20) +
                e.display("fill") +
                e.update(i,checkMode)
            )
        }
    } else {
        particles.forEach(e =>
            e.coloring(col1, col2, col3, 155) +
            e.display("fill", valSize) +
            e.update(frameCount,checkMode)
            //e.update("",rngDirection(frameCount)[0], rngDirection(frameCount)[1])
        )
/*
        for (let i = 0 i < 10 i++) {
            particles.forEach(e =>
                e.coloring(col1, col2, col3, 155) +
                e.display("fill", valSize) +
                e.update(i,checkMode)
                //e.update("",rngDirection(frameCount)[0], rngDirection(frameCount)[1])
            )
        }
*/
    }


// TEXT ------------------
    noStroke()
    if (frameCount % 60 == 0 || frameCount == 1) {
        spanTimeInS.elt.innerHTML = "<br><br><br><br><br>"+s+"s"
    }

    speed += 0.1



    //console.log("x:",particles[0].x, "y",particles[0].y,"\nrX",particles[0].rand_x,"rY",particles[0].rand_y, "Size",particles[0].radius)
    //console.log()

} // END OF DRAMA



let oldP = {x:0,y:0}
let newP = {x:0,y:0}
function createNewPoint(x,y) {
    oldP = {x:x,y:y}
    if(oldP.x == newP.x && oldP.y == newP.y || newP.x == 0 && newP.y == 0) {

        let newX = randomRNG(100,width-100)
        let newY = randomRNG(100,height-100)
        newP = {x:newX, y:newY}
    }

    return newP
}

function checkModeEvent() {
    if (this.checked()) {
        checkMode = ""
        forBool = true
    } else {
        checkMode = "flow"
        forBool = false
    }
}

function resetBG(){
    background("#1c1c24")
}

function resetLines(){
    particles.forEach(e => e.reset(particlesCount))
}

// Random Color
function getRandomColor() {
    var letters = '0123456789ABCDEF'
    var color = '#'
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}

function easyTri(x, y, nr) {
    triangle(x, y, x + nr / 2, y + (Math.sqrt(3) / 2) * nr, x - nr / 2, y + (Math.sqrt(3) / 2) * nr)
}

function randomRNG(min,max) {
    return Math.random() * (max - min) + min
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

function getAorB(a,b) {
    arr = [a,b]
    return arr[Math.round(Math.random())]
}
