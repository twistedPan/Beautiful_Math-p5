// "#232322"
const sSArr = [800, 1080, 1920, 1440, 2560, 1200, 1200]
const can = {w:sSArr[0],h:sSArr[0]}
const half = {w:can.w/2,h:can.h/2}

let speed=0;
const rngColor = getRandomColor();

const cell = 40
const cellSize = can.w/cell
let particles = []
let particlesCount = 1
let cellStructure = []
let xoff = 0
let yoff = 0

let col1 = 0
let col2 = 0
let col3 = 0
let bgC = "rgba(11, 15, 11, 1)"
let currentFrame = 0
//==============================================================================
//  ------------------------------- CLASSES ------------------------------------
//==============================================================================
class Particle {
    constructor(x, y, r) {
        this.x = x
        this.y = y
        this.size = r || cellSize
        this.color = 0
        this.direction = getOne(1,-1)
    }
    update(cell) {
        this.x += cellSize
        this.left = -1 * cellSize
        this.right = 1 * cellSize

        if (this.x > can.w) {
            this.x = cellSize/2
            this.y += cellSize*3
        }

        if (this.y > can.h+cellSize*4) {
            background(bgC)
            particles[0].reset()
        }
    }
    display() {

        if (Math.random() < 0.8) rect(this.x, this.y, this.size)
        if (Math.random() < 0.4) rect(this.x, this.y+this.left, this.size)
        if (Math.random() < 0.4) rect(this.x, this.y+this.right, this.size)
    }
    coloring(c1, c2, c3, a) {

        this.color = color(c1, c2, c3, a)
        fill(this.color)
    }

    reset() {
        particles = []
        for (let i = 0; i < particlesCount; i++) {
            particles[i] = new Particle(cellSize/2,cellSize*1.5)
        }
    }
}

//==============================================================================
//  ------------------------------- SETUP --------------------------------------
//==============================================================================
function setup() {
    var myCan = createCanvas(can.w, can.h)
    frameRate(60)
    background(bgC)
    strokeWeight(1)
    noStroke()
    colorMode(HSB)
    rectMode(CENTER)

    for (let i = 0; i < particlesCount; i++) {
        particles[i] = new Particle(
            cellSize/2, cellSize*1.5)
    }
}

//==============================================================================
//  ------------------------------- DRAW ---------------------------------------
//==============================================================================
function draw() {
    //noLoop()

    col1 = Math.abs(int(sin(speed)*100))
    col2 = Math.abs(int(cos(speed)*200))
    col3 = Math.abs(int(cos(speed)*100))
    //col3 = 100
    //console.log(":",col1,col2,col3)

    particles.forEach(e =>
        e.coloring(col1,col2,col3, 155) +
        e.display() +
        e.update()
    )

    //rect(cellSize*6,cellSize*7,cellSize*4)

    speed += 0.3

// LOGGER
    let consoleDisplay = {col1,col2,col3}
    //console.table(consoleDisplay)

} // END OF DRAMA

//==============================================================================
//  ------------------------------- FUNCTIONS ----------------------------------
//==============================================================================

function mouseClicked() {
    let click = {x:mouseX, y:mouseY}
    console.log(click.x,":",click.y)
    if (click.x < width/10 && click.y < height/10) saveCanvas('myCanvas', 'png')
}



// jump between start and end with step // -- needs class to generate multiple differs
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

// Random Color
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
// choose random a or b
function getOne(a, b) {
    arr = [a, b]
    return arr[Math.round(Math.random())]
}
// random in range of min max
function randomRNG(min, max) {
    return Math.round(Math.random() * (max - min) + min)
}
// get nr round to 2 decimal
function r2N(v) {
    return (Math.round(v*100))/100
}
function easyTri(x, y, height) {
    let root3 = Math.sqrt(3)
    circle(x,y,(root3/3 * (height*2/root3)))
    triangle(
        x, y - root3/3 * (height*2/root3),
        x - (height*2/root3/2), y + (root3/3 * (height*2/root3))/2,
        x + (height*2/root3/2), y + (root3/3 * (height*2/root3))/2
    )
}
