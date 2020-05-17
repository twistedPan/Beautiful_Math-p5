// "#232322"
const sSArr = [900, 1080, 1920, 1440, 2560, 1200, 1200]
const can = {w: sSArr[0],h: sSArr[0]}
const half = {w: can.w / 2,h: can.h / 2}

let speed = 0;
const rngColor = getRandomColor();

let c3ll
const cellCount = 60
const cellSize = can.w / cellCount
console.log("cellSize:",cellSize)
let cells = []
let cellGrid = []
let run = false

let col1 = 0
let col2 = 0
let col3 = 0
let bgC = "rgba(11, 15, 11, 1)"

let fr = 60
let transp = 0.5
let startBtn
let clearBtn
//==============================================================================
//  ------------------------------- CLASSES ------------------------------------
//==============================================================================
class Cell {
    constructor(x, y,state) {
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
        this.state = state || 0
        this.size = cellSize
        this.age = 1
    }
    getNeighbors() {
        let alivies = 0
        let ngbrs = cellGrid[this.x][this.y].neighbors

        for (let n in ngbrs) {
            if (cellGrid[ngbrs[n].x][ngbrs[n].y].state == 1) alivies++
        }

        this.nCount = alivies
    }
    update() {
        this.getNeighbors()
        // nCount <= 1 || nCount >= 4 => Dead
        // nCount >= 2 && nCount <= 3 => ha ha ha ha Stay Alive
        if (this.nCount <= 1 || this.nCount >= 4) this.state = 0
        if (this.nCount >= 2 && this.nCount <= 3) this.state = 1

        if (this.state == 1) this.age += 1
        else this.age = 1
/*

        1. Basic Life
        if (this.nCount <= 1 || this.nCount >= 4) this.state = 0
        if (this.nCount == 3) this.state = 1

        2. Crazy life 
        if (this.nCount <= 1 || this.nCount >= 4) this.state = 0
        if (this.nCount >= 2 && this.nCount <= 3) this.state = 1

        3.
        if (this.nCount <= 1 || this.nCount >= 5) this.state = 0
        else if (this.nCount >= 2 && this.nCount <= 4) this.state = 1


Death: If a cell is alive (state = 1) it will die (state becomes 0) under the following circumstances..

Overpopulation: If the cell has >=4 alive neighbors, it dies.
Loneliness: If the cell has <=1 alive neighbors, it dies.

Birth: If a cell is dead (state = 0) it will come to life (state becomes 1)
       if it has exactly 3 alive neighbors (no more, no less).
Stasis: In all other cases, the cell state does not change.
        To be thorough, let’s describe those scenarios.

Staying Alive: If a cell is alive and has exactly two or three live neighbors, it stays alive.

Staying Dead: If a cell is dead and has anything other than three live neighbors, it stays dead.

nCount <= 1 || nCount >= 4 => Dead
nCount >= 2 && nCount <= 3 => ha ha ha ha Stay Alive



*/
    }
    display(preview) {
        
        if (this.state == 1) fill("rgba("+(10*(this.age))+", 190, 49, "+transp+")")
        else fill(bgC)

        if (preview) {fill(preview)}

        rect(
            this.x *this.size + this.size/2,
            this.y/1.5 * this.size + this.size/2,
            this.size-2,this.size-2,
            40,0)
    }
    log() {
        console.table("x: ",this.x,"y: ",this.y)
        console.table(this.neighbors)
    }
    setAlive() {
        let ngbrs = cellGrid[this.x][this.y].neighbors
        for (let e in ngbrs) {
            cellGrid[ngbrs[e].x][ngbrs[e].y].state = 1
        }
    }
    reset() {
        this.state = 0
    }
}


//==============================================================================
//  ------------------------------- SETUP --------------------------------------
//==============================================================================
function setup() {
    var myCan = createCanvas(can.w, can.h)
    frameRate(fr)
    background(bgC)
    strokeWeight(0.4)
    colorMode(HSB)
    rectMode(CENTER)

    startBtn = document.getElementById("startBtn")
    clearBtn = document.getElementById("clearBtn")

    cellBlocks = Math.round(cellCount * 2.04)
// Grid full of Cells
    for (let i = -1; i < cellBlocks; i++) {
        cellGrid[i] = []
        for (let j = -1; j < cellBlocks; j++) {
            cellGrid[i][j] = new Cell(i,j,getOne(0,1)) // ,getOne(0,1)
        }
    }
    
    for(let i = 0; i<cellGrid.length-1; i+=2) {
        for (let j = 0; j<cellGrid[i].length-1; j+=2) {
            cellGrid[i][j].state = 1
        }
    }

// Show Grid with states
    //stroke(24)
    cellGrid.forEach((row) => {
        row.forEach((c) => {
            c.display()
        });
    });
}



//==============================================================================
//  ------------------------------- DRAW ---------------------------------------
//==============================================================================
function draw() {
    noStroke()
    col1 = Math.abs(int(sin(speed) * 100))
    col2 = Math.abs(int(cos(speed) * 200))
    col3 = Math.abs(int(cos(speed) * 100))
    speed += 0.3


    if (run) {
        for(let i = 0; i<cellGrid.length-1; i++) {
            for (let j = 0; j<cellGrid[i].length-1; j++) {
                cellGrid[i][j].update()
                cellGrid[i][j].display()
            }
        }
    }

    startBtn.onclick = start
    clearBtn.onclick = resetBG
} // END OF DRAMA




//==============================================================================
//  ------------------------------- FUNCTIONS ----------------------------------
//==============================================================================

function mouseMoved() {
    if (mouseX < width && mouseY < height) {
        let i = Math.floor(mouseX / cellSize)
        let j = Math.floor(mouseY / cellSize)
        cellGrid.forEach((row) => {row.forEach((c) => {c.display()});});
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
        console.log(click.x, ":", click.y, " = ", cellGrid[i][j], "\nAlive = ",nArr)

        cellGrid[i][j].state = 1
        cellGrid.forEach((row) => {row.forEach((c) => {
                c.display()
            });
        });
    }
}


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

function resetBG() {
    run = false
    startBtn.innerText = "Start"
    clear()
    //stroke(24)
    background(bgC)

    cellGrid.forEach((row) => {row.forEach((c) => {
            c.reset()
            c.display()
        });
    });
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
