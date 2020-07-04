class Lines {
    constructor(x1,y1,x2,y2) {
        this.x1 = x1
        this.y1 = y1
        this.x2 = x2
        this.y2 = y2

        this.display()
    }
    display() {
        line(this.x1,this.y1,this.x2,this.y2)
    }
}

/*
Dragon curve
    variables : X Y
    constants : F + −
    start : FX
    rules : (X → X+YF+), (Y → −FX−Y)
    angle : 90°
*/


let axiom = "F"
let sentence = "X"  // "F" || "X"
let rule = {
    a:[" ","X","F"],
    b:  [
        "FF+[+F-F-F]-[-F+F+F]", // Org
        "F+[[X]-X]-F[-FX]+X",
        "FF",
        //"FF+[+F-F-F][F+F+F][--F+F+F]+[-F-F-F]" // Weird
    ]
}
ruleInd = 0
/*
Rules:
    "FF+[+F-F-F]-[-F+F+F]"
    "FF+[+F-F-F][F+F+F][--F+F+F]+[-F-F-F]"
*/

function generate() {
    let next = ""
    for (let i=0; i<sentence.length; i++) {
        let current = sentence.charAt(i)
        

        //if (current === rule.a) {
        if (rule.a.includes(current)) {
            let bi = rule.a.findIndex(e => e===current)
            next += rule.b[bi]
        } else {
            next += current
        }
    }
    sentence = next
    //console.log(":",sentence)
}

  
let lineArr = []
let len = 200
let deg = 25
let bgC = "rgb(113,222,110)"
  



function setup() {
    createCanvas(600, 800);
    angleMode(DEGREES)
    background(bgC)
    strokeWeight(1)

    createP("PRESS SPACE");
    //lenP = createP("Len")
    //lenSl = createSlider(1, 300, 100, 1)
    degSl = createSlider(1, 360, deg, 1)
    degP = createP("Deg")

    turtle()
}
  



function draw() {
    //let lenV = lenSl.value()
    //lenP.elt.innerText ="Len: " + lenV
    let degV = degSl.value()
    degP.elt.innerText ="Deg: " + degV


    turtle(-width/2,0,degV)


/* 
    for (let i=1; i<30; i+=1) {
        turtle(-(random(0, width)),-(random(0, height)),degV)
    }
    noLoop()
     */
}



function turtle(x,y,degV) {
    resetMatrix()
    translate(width + x,height + y)
    for (let i = 0; i<sentence.length; i++) {
        let current = sentence.charAt(i)

        if (current === "F") {
        line(0,0,0,-len)
        translate(0, -len)
        } else if (current === "+") {
        rotate(degV)
        } else if (current === "-") {
        rotate(-degV)
        } else if (current === "[") {
        push()
        } else if (current === "]") {
        pop()
        } 
    }
}

function keyPressed() {
    console.log(":",keyCode)
    if (keyCode == 32) {
        if (len > 10) len /= 2
        generate()
        //draw()
    } else if (keyCode == 80) {
        turtle(x-random(100, 400),y,degV/2)
    }
    console.log(":",len)
}

function mouseDragged(event) {
    if (mouseY >= 0 && mouseY <= height) {
        width += (movedX)
        height += (movedY) 
    }
    background(bgC);
}

function getOne(a, b) {arr = [a, b];return arr[Math.round(Math.random())]}