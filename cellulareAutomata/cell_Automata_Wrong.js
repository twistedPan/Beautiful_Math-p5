// "#232322"
const sSArr = [1050, 1100, 1920, 1440, 2560, 1200, 1200]
const can = {w: sSArr[0],h: sSArr[0]}
const half = {w: can.w / 2,h: can.h / 2}

var keyMap = {}; 
onkeydown = onkeyup = function(e){
    keyMap[e.keyCode] = e.type == 'keydown';
    //console.log("key", e.keyCode);
}

let speed = 0;
const rngColor = getRandomColor();

let xOff = 0
const cellCount = 120
const cellSize = Math.round(can.w / cellCount)
let cellGrid = []
let run = false
let century = 0

let col1 = 0
let col2 = 0
let col3 = 0
let bgC = "rgb(11, 15, 11)"
let shVal = 0
let drawArr = []
let transp = 1
let startBtn
let clearBtn
//==============================================================================
//  ------------------------------- CLASSES ------------------------------------
//==============================================================================
class Cell {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.neighbors = {
            lTop: {x:this.x-1,y:this.y-1},
            top: {x:this.x,y:this.y-1},
            rTop: {x:this.x+1,y:this.y-1},
            left: {x:this.x-1,y:this.y},
            right: {x:this.x+1,y:this.y},
            lBottom: {x:this.x-1,y:this.y+1},
            bottom: {x:this.x,y:this.y+1},
            rBottom: {x:this.x+1,y:this.y+1},
        }
        this.nCount = 0
        this.state = 0
        this.size = cellSize
        this.age = 1
        
    }

    update(mode) {              // updated jede zelle und nachbarn sofort muss aber warten bis fertig geckeckt
        this.getNeighbors()
        

        if (mode == 1) {    // 1. Basic Life
            if (this.nCount <= 1 || this.nCount >= 4) this.state = 0
            if (this.nCount == 3) this.state = 1
        } 
        else if (mode == 2){ // 2. Crazy life 
            if (this.nCount <= 1 || this.nCount >= 4) this.state = 0
            if (this.nCount >= 2 && this.nCount <= 3) this.state = 1
        } 
        else if (mode == 3) { // 3. Dissolving Pattern
            if (this.nCount <= 1 || this.nCount >= 5) this.state = 0
            else if (this.nCount >= 2 && this.nCount <= 4) this.state = 1
        }
        else if (mode == 4) { // 4. Cloud District
            if (this.nCount == 3 || this.nCount == 4 || this.nCount == 6 || 
                this.nCount == 7 || this.nCount == 8) this.state = 1
        }
        else if (mode == 5) { // 5. Day & Night
            if (this.nCount == 3 || this.nCount == 4 || this.nCount == 6 || 
                this.nCount == 7 || this.nCount == 8) this.state = 1
            else this.state = 0
        }
        else if (mode == 6) { // 6. Evolwing from Ground
            if (this.nCount == 2 || this.nCount == 8) this.state = 1
            else this.state = 0
        }
        else {  // Basic Life
            if (this.nCount <= 1 || this.nCount >= 4) this.state = 0
            if (this.nCount == 3) this.state = 1
        }

        
        if (this.state == 1) this.age += 1
        else this.age = 1

        if (this.age > 120) {
            this.killAll()
        }
/*

        // 1. Basic Life - B23 / S14
        if (this.nCount <= 1 || this.nCount >= 4) this.state = 0
        if (this.nCount == 3) this.state = 1

        // 2. Crazy life 
        if (this.nCount <= 1 || this.nCount >= 4) this.state = 0
        if (this.nCount >= 2 && this.nCount <= 3) this.state = 1

        // 3. Dissolving Pattern
        if (this.nCount <= 1 || this.nCount >= 5) this.state = 0
        else if (this.nCount >= 2 && this.nCount <= 4) this.state = 1

        // 4. Cloud District
        if (this.nCount == 3 || this.nCount == 4 || this.nCount == 6 || 
            this.nCount == 7 || this.nCount == 8) this.state = 1
        
        // 5. Day & Night - B3678 / S34678
        if (this.nCount == 3 || this.nCount == 4 || this.nCount == 6 || 
            this.nCount == 7 || this.nCount == 8) this.state = 1
        else this.state = 0

        // 6. Evolwing from Ground
        if (this.nCount == 2 || this.nCount == 8) this.state = 1
        else this.state = 0


B23 /S14
nCount <= 1 || nCount >= 4 => Dead
nCount == 3 ha ha ha ha Stay Alive

B3678/S34678 
nCount == 3, 6, 7, or 8 live neighbors => Birth
nCount == 3, 4, 6, 7, or 8 live neighbors => stay Alive
else die!



fill("rgba(145, "+(10*(this.age))+", 249, "+transp+")") = Old Skool Horror Game
fill("rgba("+(10*(this.age))+", 45, 249, "+transp+")") = cold Fire
*/
            this.display()
    }

    getNeighbors() {
        let alivies = 0
        let ngbrs = cellGrid[this.x][this.y].neighbors
        for (let n in ngbrs) {
            if (cellGrid[ngbrs[n].x][ngbrs[n].y].state == 1) alivies++
        }
        this.nCount = alivies
    }

    display(preview,displace) {
        col1 = 128+(this.age*5)
        col2 = 245-(this.age*5)
        col3 = 0+(this.age*5)
        let colo = "rgba("+col1+","+col2+","+col3+","+transp+")"

        if (this.state == 1) fill(colo)
        else fill(bgC)

        if (preview) fill(preview)
        
        push()
        if (displace) {
            xOff++
            if (xOff == (cellGrid.length+3) *2) xOff = 0
            if (xOff > cellGrid.length) {
                translate( (this.x) * this.size, (this.y+1) * this.size)
            }
            else {
                translate( (this.x) * this.size, (this.y) * this.size)
            }
        } else {
            translate( (this.x) * this.size, (this.y) * this.size)
        }

        rect(0,0, this.size,this.size, 0,0)
        pop()

    }

    log() {
        console.table("x: ",this.x,"y: ",this.y)
        console.table(this.neighbors)
    }
    reviveAll() {
        let ngbrs = cellGrid[this.x][this.y].neighbors
        for (let e in ngbrs) {
            cellGrid[ngbrs[e].x][ngbrs[e].y].state = 1
        }
        this.state = 1
    }
    killAll() {
        let ngbrs = cellGrid[this.x][this.y].neighbors
        for (let e in ngbrs) {
            cellGrid[ngbrs[e].x][ngbrs[e].y].state = 0
        }
        this.state = 0
    }
    reset() {
        for (let i = -1; i < cellCount+1; i++) {
            cellGrid[i] = []
            for (let j = -1; j < cellCount+4; j++) cellGrid[i][j] = new Cell(i,j)
        }
    }
}


//==============================================================================
//  ------------------------------- SETUP --------------------------------------
//==============================================================================
function setup() {
    var myCan = createCanvas(can.w, can.h)
    frameRate(25)
    background(bgC)
    strokeWeight(0.4)
    colorMode(HSB)
    //rectMode(CENTER)
    angleMode(DEGREES)
    noStroke()

    startBtn = document.getElementById("startBtn")
    clearBtn = document.getElementById("clearBtn")
    shuffleBtn = document.getElementById("shuffleBtn")
    shuffleInp = document.getElementById("shuffleInp")
    selectInp = document.getElementById("selct")


// Grid full of Cells
    for (let i = -1; i < cellCount+1; i++) {
        cellGrid[i] = []
        for (let j = -1; j < cellCount+4; j++) cellGrid[i][j] = new Cell(i,j)
    }

// Set States
let centered = int(cellCount/2.5)
    for(let i = centered+1; i<cellGrid.length-centered-1; i+=2) {
        for (let j = centered+1; j<cellGrid[i].length-centered-1; j+=2) cellGrid[i][j].state = 1
    }
    
    displayGrid()

console.log("cellSize:",cellSize, "rowCount", cellGrid.length)
}



//==============================================================================
//  ------------------------------- DRAW ---------------------------------------
//==============================================================================
function draw() {
    noStroke()

    if (run) {
        //if (frameCount % 10 == 0) saveCanvas('myCanvas', 'png')   // save Canvas -------------
        /* for(let i = 0; i<cellGrid.length-1; i++) {
            for (let j = 0; j<cellGrid[i].length-1; j++) {
                cellGrid[i][j].update(selectInp.value)
            }
        } */

        cellGrid.forEach((row, i) => {
            if (i < cellCount) row.forEach((cell, j) => {
                if (j < cellCount) cell.update(selectInp.value)
        })})
        century++
    }

    startBtn.onclick = start
    clearBtn.onclick = resetField
    shuffleBtn.onclick = shuffleField
    shVal = shuffleInp.value | 0.01
} // END OF DRAMA




//==============================================================================
//  ------------------------------- FUNCTIONS ----------------------------------
//==============================================================================
function mouseMoved() {
    if (mouseX < width && mouseY < height && !run) {
        
        let i = Math.floor(mouseX / cellSize)
        let j = Math.floor(mouseY / cellSize)

        if (!keyMap[17]) { // ctrl
            //cellGrid[i+1].forEach((c) => {c.display()})
            //cellGrid[i-1].forEach((c) => {c.display()})
            //cellGrid[i][j-1].display()
            //scellGrid[i][j+1].display()
        } else if (keyMap[17]) {
            drawArr.push([i,j])
            console.log("is Drawing")
        }
        cellGrid[i][j].display("#f95959")
    }
}

function mouseClicked() {
    if (mouseX < width && mouseY < height) {

        let click = {x: mouseX,y: mouseY}
        let i = Math.floor(click.x / cellSize)
        let j = Math.floor(click.y / cellSize)
        let nArr = []
        for (let c in cellGrid[i][j].neighbors) {
            nArr.push(cellGrid[cellGrid[i][j].neighbors[c].x][cellGrid[i][j].neighbors[c].y].state)
        }
        console.log(click.x, ":", click.y, " = ", cellGrid[i][j], "\nAlive = ",nArr, " Age:", cellGrid[i][j].age)

        cellGrid[i][j].state = 1
        displayGrid()
    }
}

function keyPressed() {
    if (keyMap[83]){
        resetGrid()
        drawArr.forEach(c => cellGrid[c[0]][c[1]].state = 1)
        displayGrid()
        console.log(drawArr.join("-"))
    }
}


// Button Functions
function start() {
    if (startBtn.innerText == 'Start') {
        startBtn.innerText = "Pause"
        run = true
    }
    else {
        startBtn.innerText = "Start"
        run = false
    }
}
function resetField() {
    run = false
    startBtn.innerText = "Start"
    background(bgC)
    drawArr = []
    resetGrid()
    displayGrid()
    //location.reload()
}
function shuffleField() {
    run = false
    background(bgC)
    if (shVal > 100) shVal = 99
    cellGrid.forEach((row) => {row.forEach((c) => {
            if (Math.random() < (parseInt(shVal)/100)) c.state = 1
            else c.state = 0
            c.display()
        });
    });
}

function displayGrid() {
    cellGrid.forEach((row) => {row.forEach((c) => {c.display()});});
/*
    for(let i = 0; i<cellGrid.length-1; i++) {
        for (let j = 0; j<cellGrid[i].length-1; j++) {
            cellGrid[i][j].display()
        }
    }
*/
}
function resetGrid() {
    //cellGrid.forEach((row) => {row.forEach((c) => {c.reset()});});
    cellGrid[0][0].reset()
}

// jump between start and end with step // -- needs class to generate multiple differs
let klickBool = false
function jumpBetween(value, start, end, step) {
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
    return (Math.round(v * 100)) / 100
}

function easyTri(x, y, height) {
    let root3 = Math.sqrt(3)
    circle(x, y, (root3 / 3 * (height * 2 / root3)))
    triangle(
        x, y - root3 / 3 * (height * 2 / root3),
        x - (height * 2 / root3 / 2), y + (root3 / 3 * (height * 2 / root3)) / 2,
        x + (height * 2 / root3 / 2), y + (root3 / 3 * (height * 2 / root3)) / 2
    )
}



