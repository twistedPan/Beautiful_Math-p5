// "#232322"
let sSArr = [900, 1080, 1920, 1440, 2560, 1200, 1200]
let myWidth = sSArr[0]
let myHeight = sSArr[0]
let startValues = [myWidth,myHeight]

let pArr = []
let angle = 0
let speed = 0;
let rotating = 0
let rngColor = getRandomColor();

let tArr = [] // test Array

let valEle = 100
let valFac = 0
let valForm = 0
let valMode = 0

let color = [155,233,111,255]
let alphaMap = 0

let linesBool = false
let pointsBool = false
let rectBool = false

let ckForChange = []
let txtMap = 0

//===============================================================================
//  ------------------------------- PRELOAD ---------------------------------
//===============================================================================
function preload() {
    //apache = loadModel('assets/apacheH.obj');
    pinkArr = [
        loadImage('assets/pinkGuy2-t.png'),
        loadImage('assets/pinkGuy3-t.png'),
        loadImage('assets/pinkGuy-t.png'),
    ]
}

//===============================================================================
//  ------------------------------- SETUP ---------------------------------
//===============================================================================
function setup() {
    let myCan = createCanvas(myWidth, myHeight, WEBGL);
    canvas = myCan.canvas;
    frameRate(60);
    background(0);
    stroke(255);
    strokeWeight(0.6);
    
    createEasyCam();
    //document.oncontextmenu = function() { return false; }
    //document.onmousedown   = function() { return false; }
    
    //perspective(PI / 3.0, width/height, 0.1, 500)
    
// ELEMENTS
    createP("")
    sliderElements = createSlider(1, 200, 20, 1) // <------------------ ELEments
    sliderElements.position(0, myHeight+30)
    sliderElements.style('width', '100px')
    spanEle = createSpan("Number of Elements")
    spanEle.style('marginLeft', '10px')
    
// SECTORS
    sliderSect = createSlider(1, 500, 23, 1) // <------------------ SECTORS
    sliderSect.position(140, myHeight+30)
    sliderSect.style('width', '100px')
    spanSect = createSpan("Sectors: ")
    spanSect.style('marginLeft', '60px')  
    
// FACTOR
    sliderFactor = createSlider(0, 200, 2, 0.5) // <------------------ FACTOR
    sliderFactor.position(280, myHeight+30)
    sliderFactor.style('width', '100px')
    spanFac = createSpan("Factor: ")
    spanFac.style('marginLeft', '70px')

    createP("<br><br>")
    
// ROTATION
    sliderRotationX = createSlider(-180, 180, 0, 0.5)
    sliderRotationX.position(105, myHeight+58)
    sliderRotationX.style('width', '90px')
    spanRotateX = createSpan("Rotate: ")
    spanRotateX.style('marginLeft', '10px')
    sliderRotationY = createSlider(-180, 180, 0, 0.5)
    sliderRotationY.position(105, myHeight+94)
    sliderRotationY.style('width', '90px')
    createP("<br>")
    spanRotateY = createP("Rotate: ")
    spanRotateY.style('marginLeft', '10px')
    sliderRotationZ = createSlider(-180, 180, 0, 0.5)
    sliderRotationZ.position(105, myHeight+128)
    sliderRotationZ.style('width', '90px')
    createP("<br>")
    spanRotateZ = createP("Rotate: ")
    spanRotateZ.style('marginLeft', '10px')
    
    
// MODE POINTS, LINES, TRIANGLES, TRIANGLE_FAN, TRIANGLE_STRIP, QUADS, QUAD_STRIP, and TESS
    createSpan("<br>")
    selForm = createSelect();
    selForm.option('TESS ','tss');
    selForm.option('POINTS','p');
    selForm.option('LINES','l');
    selForm.option('TRIANGLES ','t');
    selForm.option('TRIANGLE_FAN ','tf');
    selForm.option('TRIANGLE_STRIP ','ts');
    selForm.option('QUADS ','q');
    selForm.option('QUAD_STRIP ','qs');
    selForm.style('width', '130px');
    selForm.style('marginTop', '10px');
    selForm.style('marginLeft', '10px');
    selForm.style('position', 'absolute');
    selForm.style('top', myHeight+120+'px');
    selForm.style('left', '240px');
    
    
// Stuff
    //checkboxText = createCheckbox('show numbers', false);
    //checkboxText.style("marginTop", "10px")
    checkboxAlpha = createCheckbox('alpha On', false);
    checkboxAlpha.style("marginTop", "5px")
    checkboxRotate = createCheckbox('rotation On', false);
    checkboxRotate.style("marginTop", "5px")
    checkboxAnim = createCheckbox('animate Elements', false);
    checkboxAnim.style("marginTop", "5px")
    checkboxFly = createCheckbox('fly to Z', false);
    checkboxFly.style("marginTop", "5px")

    createSpan("")
    animSpan1 = createSpan("Animate from")
    animSpan1.class("animBlock")
    startValue = createInput("1")
    startValue.style('width', '40px')
    startValue.class("animBlock")
    animSpan2 = createSpan("to")
    animSpan2.class("animBlock")
    endValue = createInput("20")
    endValue.style('width', '40px')
    endValue.class("animBlock")
    animSpan2 = createSpan("steps of ")
    animSpan2.class("animBlock")
    stepValue = createInput("1")
    stepValue.style('width', '20px')
    stepValue.class("animBlock")
    animBlock = document.getElementsByClassName("animBlock");
    for (e of animBlock) {e.style.display = "none"
                          e.style.margin = "2px"}
    
    colorPicker = createColorPicker('#0aff00');
    colorPicker.position(240, myHeight + 80);
    colorPicker.style('width', '60px');
    
    selMode = createSelect() ;selMode.elt.id = "modeRadio"
    selMode.option('Mode 1 ----- Normal',1);
    selMode.option('Mode 2 ----- aX • 2',2);
    selMode.option('Mode 3 ----- aY • 2',3);
    selMode.option('Mode 4 -- aX•2;aY/2',4);
    selMode.option('Mode 5 - M1 - r / a',5);
    selMode.option('Mode 6 - M2 - r / a',6);
    selMode.option('Mode 7 - M3 - r / a',7);
    selMode.option('Mode 8 - M4 - r / a',8);
    selMode.option('Mode 9 - M1 aY div',9);
    selMode.option('Mode 10- M2 aY div',10);
    selMode.option('Mode 11- M3 aY div',11);
    selMode.option('Mode 12- M4 aY div',12);
    selMode.option('Mode 13- M1 aX div',13);
    selMode.option('Mode 14- M2 aX div',14);
    selMode.option('Mode 15- M3 aX div',15);
    selMode.option('Mode 16- M4 aX div',16);
    selMode.style('width', '164px');
    selMode.style('position', 'absolute');
    selMode.style('top', myHeight+10+'px');
    selMode.style('left', '440px');
    
    sMode = createSlider(0, 1, 0, 1) // <------------------ MODE
    sMode.position(0, myHeight+80)
    sMode.style('width', '100px')
    
    for ( e of document.getElementsByTagName("Input")) {e.style.margin = "0 5px"}  
}


//===============================================================================
//  ------------------------------- DRAW ---------------------------------
//===============================================================================
function draw() {
    //hh = document.getElementById("ctxHeight").value
    //ww = document.getElementById("ctxWidth").value
    //canvas.width = ww
    //canvas.height = hh
    background(7, 2, 12)
    noFill();
                color[0] = colorPicker.color().levels[0]
                color[1] = colorPicker.color().levels[1]
                color[2] = colorPicker.color().levels[2]
                stroke(255)
                let count = 0
    stroke(color)
    strokeWeight(0.6);
    fill(color)
    
    color[3] =255
                
    for (e of animBlock) {e.style.display = "none"} // Hide anima Block
    valFac = sliderFactor.value()
    valSec = sliderSect.value()
    valForm = selForm.value();
    valMode = selMode.value();
    spanFac.elt.innerText = "Factor: " + valFac
    spanSect.elt.innerText = "Sectors: " + valSec

    if (checkboxAnim.child()[0].checked) {
        for (e of animBlock) {e.style.display = "inline"}
        valEle = jumpBetween(valEle,
            parseInt(startValue.value()),
            parseInt(endValue.value()),
            parseInt(stepValue.value()))
    } else valEle = sliderElements.value()
    spanEle.elt.innerText = valEle + " Elements"

    valSectorMode = sMode.value()
    valRotateX = sliderRotationX.value();
    valRotateY = sliderRotationY.value();
    valRotateZ = sliderRotationZ.value();
    spanRotateX.elt.innerText = "Rotate X: " + valRotateX
    spanRotateY.elt.innerText = "Rotate Y: " + valRotateY
    spanRotateZ.elt.innerText = "Rotate Z: " + valRotateZ
    
    if (checkboxRotate.child()[0].checked) {
        rotating += 0.01
        rotateZ(-rotating)
    }    
    if (checkboxFly.child()[0].checked) {
        speed+=10
        translate(0,0,speed)
    }

    
// Translate Room
    rotateX(radians(-valRotateX))
    rotateY(radians(-valRotateY))
    rotateZ(radians(-valRotateZ))
    //translate(valRotateX,valRotateY,valRotateZ)
    
    translate(300,600,-400)
    rotateX(radians(146))
    rotateY(radians(-20.5))
    rotateZ(radians(-68.5))
    
    
    if(!ckForChange.includes(valEle) || !ckForChange.includes(valSec) || !ckForChange.includes(valMode) || !ckForChange.includes(valSectorMode)) {
        pArr = cardoid3D((myWidth+myHeight)/2, valEle, valSec, valMode, valSectorMode)
        //pArr.push(pArr[0])
    }
    
    ckForChange = [valEle,valSec, valMode, valSectorMode]
    /*
    POINTS, LINES, TRIANGLES, TRIANGLE_FAN, TRIANGLE_STRIP, QUADS, QUAD_STRIP, and TESS
    */
    //texture(pinkArr[1])
    //box(1000)
    push();
    noFill()


    if(valForm === "p") beginShape(POINTS);
    else if(valForm === "l") beginShape(LINES);
    else if(valForm === "t") beginShape(TRIANGLES);
    else if(valForm === "tf") beginShape(TRIANGLE_FAN);
    else if(valForm === "ts") beginShape(TRIANGLE_STRIP);
    else if(valForm === "q") beginShape(QUADS);
    else if(valForm === "qs") beginShape(QUAD_STRIP);
    else if(valForm === "tss") beginShape(TESS);
    else beginShape(TESS)
    
    //texture(texture2)
    for (let i=0; i<pArr.length; i++) {
        if (typeof pArr[i * valFac] !== 'undefined') {
            
            //txtMap = map(i, 0,pArr.length, 0,2)
            //texture(pinkArr[Math.ceil(txtMap)])

            vertex(pArr[i][0],pArr[i][1],pArr[i][2])
            
            
            
            if (checkboxAlpha.child()[0].checked) {
                if (i % 20 == 0) {
                    count++
                    alphaMap = map(count, 0,(valEle*360)/(360/valSec), 100,255)
                    color[3] = alphaMap
                }
            }
        }
    }
    endShape(CLOSE);
    pop();
    //console.log(":",count);


    //noLoop()
} // END OF DRAMA





//===============================================================================
//  ------------------------------- FUNCTIONS ---------------------------------
//===============================================================================

// https://www.youtube.com/watch?v=qhbuKbxJsk8
//x = cx + r * cos(angle)
//y = cy + r * sin(angle)
function cardoid3D(diameter, points, sections, mode, sMode) {
    
    let radius = diameter/2
    let angle = 360 / sections
    let rounds = 360 * points
    let kreisBogen = ((diameter/2) * Math.PI) * (sections/360)
    let incrementer = 0
    let pointArr = []
    let moveZ = 0
    let mover = 100

    if (sMode == 0) incrementer = kreisBogen
    else incrementer = angle

    
    for (let i=0; i<=rounds; i+=incrementer) {
        
        radius += 5
        //pX = sw + radius * Math.sin(i)
        //pY = sw - radius * Math.cos(i)
        //pX = radius * Math.sin(i)
        //pY = radius * Math.cos(i)
        if (mode == 1) {
            pX = radius * Math.sin(i)
            pY = radius * Math.cos(i)
            pZ = moveZ += mover
        } else if (mode == 2) {
            pX = radius * Math.sin(i * 2)
            pY = radius * Math.cos(i)
            pZ = moveZ += mover
        } else if (mode == 3) {
            pX = radius * Math.sin(i)
            pY = radius * Math.cos(i * 2)
            pZ = moveZ += mover
        } else if (mode == 4) {
            pX = radius * Math.sin(i / 2)
            pY = radius * Math.cos(i * 2)
            pZ = moveZ += mover

        } else if (mode == 5) {            
            pX = radius / Math.sin(i)
            pY = radius / Math.cos(i)
            pZ = moveZ += mover
        } else if (mode == 6) {
            pX = radius / Math.sin(i * 2)
            pY = radius / Math.cos(i)
            pZ = moveZ += mover
        } else if (mode == 7) {
            pX = radius / Math.sin(i)
            pY = radius / Math.cos(i * 2)
            pZ = moveZ += mover
        } else if (mode == 8) {
            pX = radius / Math.sin(i / 2)
            pY = radius / Math.cos(i * 2)
            pZ = moveZ += mover

        } else if (mode == 9) {
            pX = radius * Math.sin(i)
            pY = radius / Math.cos(i)
            pZ = moveZ += mover
        } else if (mode == 10) {
            pX = radius * Math.sin(i * 2)
            pY = radius / Math.cos(i)
            pZ = moveZ += mover
        } else if (mode == 11) {
            pX = radius * Math.sin(i)
            pY = radius / Math.cos(i * 2)
            pZ = moveZ += mover
        } else if (mode == 12) {
            pX = radius * Math.sin(i * 2)
            pY = radius / Math.cos(i / 2)
            pZ = moveZ += mover

        } else if (mode == 13) {          
            pX = radius / Math.sin(i)
            pY = radius * Math.cos(i)
            pZ = moveZ += mover
        } else if (mode == 14) {
            pX = radius / Math.sin(i * 2)
            pY = radius * Math.cos(i)
            pZ = moveZ += mover
        } else if (mode == 15) {
            pX = radius / Math.sin(i)
            pY = radius * Math.cos(i * 2)
            pZ = moveZ += mover
        } else if (mode == 16) {
            pX = radius / Math.sin(i / 2)
            pY = radius * Math.cos(i * 2)
            pZ = moveZ += mover

        } else {
            pX = radius * Math.sin(i)
            pY = radius * Math.cos(i)
            pZ = moveZ += mover
        }
        
        pointArr.push([pX, pY, pZ])
    }
    //console.log("c:",rounds, "a", angle);
    return pointArr
}

let klickBool = false
function jumpBetween(value,a,b,step) {
    //let value = a + 1
    
    //console.log(value,a, b, step, klickBool)
    value = constrain(value, a,b)
    
    if (value == a) {
        klickBool = true
    } else if (value == b) {
        klickBool = false
    }
    
    if (klickBool) {
        return value += step
    } else {
        return value -= step
    }

}

function mouseDragged(event) {
    if (mouseY >= 0 && mouseY <= height) {
        width += (movedX)
        height += (movedY) 
    }
}

function doubleClicked() {
    width = startValues[0]
    height = startValues[1]
    //translate(0,0,0)
}

function resetWidth() {
    width = startValues[0]
}

// Random Color
function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function compareNum(a, b) {
  return a - b;
}

