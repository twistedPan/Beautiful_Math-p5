// "#232322"
let sSArr = [900, 1080, 1920, 1440, 2560, 1200, 1200]
let myWidth = sSArr[0]
let myHeight = sSArr[0]
let startValues = [myWidth,myHeight]

let pArr = []
let angle = 0
let speed = 0;
let rngColor = getRandomColor();

let tArr = [] // test Array

let valEle = 100
let valFac = 0
let valForm = 0
let valMode = 0

let color = [255,233,211,255]
let alphaMap = 0

let linesBool = false
let pointsBool = false
let rectBool = false


//===============================================================================
//  ------------------------------- SETUP ---------------------------------
//===============================================================================
function setup() {
    let myCan = createCanvas(myWidth, myHeight);
    canvas = myCan.canvas;
    frameRate(60);
    background(0);
    stroke(255);
    strokeWeight(0.6);
    rectMode(CENTER)
    
// ELEMENTS
    createP("")
    sliderElements = createSlider(0, 2000, 80, 1)
    sliderElements.position(0, myHeight+50)
    sliderElements.style('width', '100px')
    spanEle = createSpan("Number of Elements")
    spanEle.style('marginLeft', '10px')
    
// SECTORS
    sliderSect = createSlider(0, 500, 53, 1)
    sliderSect.position(140, myHeight+50)
    sliderSect.style('width', '100px')
    spanSect = createSpan("Sectors: ")
    spanSect.style('marginLeft', '60px')  
    
// FACTOR
    sliderFactor = createSlider(0, 200, 2, 0.1)
    sliderFactor.position(280, myHeight+50)
    sliderFactor.style('width', '100px')
    spanFac = createSpan("Factor: ")
    spanFac.style('marginLeft', '70px')
    
// COLOR NAMES
    spancL = createSpan("Color Lines")
    spancL.style('marginLeft', '90px')
    spancBG = createSpan("Color BG")
    spancBG.style('marginLeft', '15px')
    
// VIEW & DRAG
    sliderView = createSlider(0, 5000, 800, 1)
    sliderView.position(620, myHeight+50)
    sliderView.style('width', '180px')
    spanView = createSpan("View")
    spanView.style('marginLeft', '30px')
    
    mouseDrag = createCheckbox('Mouse Drag', false);
    mouseDrag.style("display","inline")
    mouseDrag.style("marginLeft","10px")
    
    centerBtn = createButton("center")
    centerBtn.style("marginLeft", "10px")
    centerBtn.mousePressed(resetWidth)
    
    createSpan("<br>")
    createP("<br><br>")
    
// ROTATION
    sliderRotation = createSlider(0, 360, 0, 0.5)
    sliderRotation.position(100, myHeight+115)
    sliderRotation.style('width', '66px')
    spanRotate = createSpan("Rotate: ")
    spanRotate.style('marginLeft', '10px')
    
    
// MODE
    radioForm = createRadio();
    radioForm.option('Lines','l');
    radioForm.option('Rects','r');
    radioForm.option('Points','p');
        //createP("<br>")
        redBox = createCheckbox("R = [ (pX + ( pX • fac )) /2; (pY + ( pY • fac )) /2 ]", true)
        redBox.style("display", 'none'); redBox.style("marginLeft", '20px')
        grnBox = createCheckbox("G = [ pX; pX • fac ]", true)
        grnBox.style("display", 'none'); grnBox.style("marginLeft", '20px')
        bluBox = createCheckbox("B = [ pY; pY • fac ]", true)
        bluBox.style("display", 'none'); bluBox.style("marginLeft", '20px')
        witheSpan = createSpan("White = without fac")
        witheSpan.style("display", 'none'); witheSpan.style("marginLeft", '25px')
    //radioForm.option('Trian','t');
    radioForm.style('width', '69px');
    radioForm.style('marginTop', '10px');
    radioForm.style('marginLeft', '10px');
    
    
// Stuff
    checkboxText = createCheckbox('show numbers', false);
    checkboxText.style("marginTop", "10px")
    checkboxAlpha = createCheckbox('alpha On', false);
    checkboxAlpha.style("marginTop", "5px")
    checkboxRotate = createCheckbox('rotation On', false);
    checkboxRotate.style("marginTop", "5px")
    checkbox = createCheckbox('animate Elements', false);
    checkbox.style("marginTop", "5px")

    createSpan("")
    animSpan1 = createSpan("Animate from")
    animSpan1.class("animBlock")
    startValue = createInput("1")
    startValue.style('width', '40px')
    startValue.class("animBlock")
    animSpan2 = createSpan("to")
    animSpan2.class("animBlock")
    endValue = createInput("100")
    endValue.style('width', '40px')
    endValue.class("animBlock")
    animSpan2 = createSpan("steps of ")
    animSpan2.class("animBlock")
    stepValue = createInput("2")
    stepValue.style('width', '20px')
    stepValue.class("animBlock")
    animBlock = document.getElementsByClassName("animBlock");
    for (e of animBlock) {e.style.display = "none"
                          e.style.margin = "2px"}
    
    colorPicker = createColorPicker('#0aff00');
    colorPicker.position(440, myHeight + 53);
    colorPicker.style('width', '60px');
    //colorPicker.style('backgroundColor', '#000000');
    
    colorPickerBG = createColorPicker('rgb(0, 0, 0)');
    colorPickerBG.position(525, myHeight + 53);
    colorPickerBG.style('width', '60px');
    
    createP("<br>Nice Sectors:<br>Sectors: 86,91<br>").style("marginLeft", "20px")
    
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
    selMode.style('top', myHeight+100+'px');
    selMode.style('left', '400px');
    
    selBroken = createSelect()
    selBroken.option('Math done right',1);
    selBroken.option('Math is broken',2);
    selBroken.style('width', '164px');
    selBroken.style('position', 'absolute');
    selBroken.style('top', myHeight+120+'px');
    selBroken.style('left', '400px');
    
    for ( e of document.getElementsByTagName("Input")) {e.style.margin = "0 5px"}
    createP("<br><br><br><br> ")   
}

/*
Nice Ele Numbers:
1146, 659


*/

//===============================================================================
//  ------------------------------- DRAW ---------------------------------
//===============================================================================
function draw() {
    background(colorPickerBG.color())
    noFill();
    color[0] = colorPicker.color().levels[0]
    color[1] = colorPicker.color().levels[1]
    color[2] = colorPicker.color().levels[2]
    stroke(color)
    translate(width/2,height/2)
    strokeWeight(0.6);
    
    for (e of animBlock) {e.style.display = "none"}
    valFac = sliderFactor.value()
    spanFac.elt.innerText = "Factor: " + valFac
    valSec = sliderSect.value()
    spanSect.elt.innerText = "Sectors: " + valSec
    valForm = radioForm.value();
    valMode = selMode.value();
    valView = sliderView.value();
    spanView.elt.innerText = "View: " + valView
    valBroken = selBroken.value()
    if(deltaTime >= 200) valBroken = 2
    myWidth = myHeight = valView
    
    if (checkbox.child()[0].checked) {
        /*
        if (Math.sin(speed) > 0) valEle += 10
        else valEle -= 10
        */
        for (e of animBlock) {e.style.display = "inline"}
        valEle = jumpBetween(valEle,
            parseInt(startValue.value()),
            parseInt(endValue.value()),
            parseInt(stepValue.value()))
    } else valEle = sliderElements.value()
        
    spanEle.elt.innerText = valEle + " Elements"
    
    if (checkboxRotate.child()[0].checked) {
        speed += 0.01
        rotate(speed)
    }
    valRotate = sliderRotation.value();
    spanRotate.elt.innerText = "Rotate: " + valRotate
    rotate(radians(valRotate))
    
    pArr = cardoid((myWidth+myHeight)/2.05, valEle, valSec, valMode)
    color[3] =255
    let count = 0
    noFill()
    for (let i=0; i<pArr.length; i++) {
        if (typeof pArr[i * valFac] !== 'undefined') {
            
            redBox.style('display', 'none')
            bluBox.style('display', 'none')
            grnBox.style('display', 'none')
            
            if(valForm === "l")
                line(pArr[i][0],pArr[i][1], pArr[i*valFac][0],pArr[i*valFac][1])
            
            else if(valForm === "p") {
                redBox.style('display', 'block')
                bluBox.style('display', 'block')
                grnBox.style('display', 'block')
                witheSpan.style('display', 'block')
                strokeWeight(3)
                
                stroke("red");fill("red")
                if (redBox.child()[0].checked)
                    point((pArr[i][0]+pArr[i*valFac][0])/2,(pArr[i][1]+pArr[i*valFac][1])/2)
                
                stroke("#00ff00");fill("#00ff00")
                if (bluBox.child()[0].checked)
                    point((pArr[i][1]),(pArr[i*valFac][1]), 2)
                
                stroke("#00c4ff");fill("#00c4ff")
                if (grnBox.child()[0].checked)
                    point((pArr[i][0]),(pArr[i*valFac][0]), 2)
                
                stroke("#727272");fill("#696969")
                //if (grnBox.child()[0].checked)
                    point((pArr[i][0]),(pArr[i][1]), 2)
                
            }
            else if(valForm === "r")
                rect((pArr[i][0]+pArr[i][1])/2,(pArr[i*valFac][1]+pArr[i*valFac][1])/2, valSec)
            
            else
                line(pArr[i][0],pArr[i][1], pArr[i*valFac][0],pArr[i*valFac][1])
            
            if (checkboxAlpha.child()[0].checked) {
                if (i % 20 == 0) {
                    count++
                    alphaMap = map(count, 0,(valEle*360)/(360/valSec), 100,255)
                    color[3] = alphaMap
                }
            }
            
        }
    }
    //console.log(":",count);
    
    
    //noLoop()
    
    
// Info Stuff
    if(checkboxText.child()[0].checked){
        noFill()
        strokeWeight(0.1);
        
        circle(0,0,(myWidth+myHeight)/2.1)
        rect(0,0, myWidth-5,myHeight-5)
        angle = 360 / valSec

        fill(colorPicker.color())

        for(let i=0;i<=360;i += angle) {

            let posX = ((myWidth+myHeight)/2.05)/1.97 * Math.sin(i)
            let posY = ((myWidth+myHeight)/2.05)/1.97 * Math.cos(i)

            circle(posX,posY,5)
            //tArr.push([posX,posY])
        }

        fill(255)
        noStroke()
        
        translate(-(width/2), -(height/2))
        
        text("Elements "+valEle,5,height-10)
        text("Sectors "+valSec,95,height-10)
        text("Factor "+valFac,185,height-10)
        
    }
    
} // END OF DRAMA





//===============================================================================
//  ------------------------------- FUNCTIONS ---------------------------------
//===============================================================================

// https://www.youtube.com/watch?v=qhbuKbxJsk8
//x = cx + r * cos(angle)
//y = cy + r * sin(angle)
function cardoid(diameter, points, sections, mode) {
    
    let sw = myWidth / 2  // positionierung
    let sh = myHeight / 2 // positionierung
    let radius = diameter/2
    let pX = 0
    let pY = 0
    let pushA
    let pushB
    let angle = 360 / sections
    let rounds = 360 * points
    let ksector = ((2*radius) * Math.PI) * (sections/360)
    let pointArr = []
    let incrementer = ksector
    //console.log(":",ksector);
    if(valBroken == 2) incrementer = angle
    else incrementer = ksector
    
    
    for (let i=0; i<=rounds; i+=incrementer) {
        
        if (mode == 1) {
            pX = radius * Math.sin(i)
            pY = radius * Math.cos(i)
        } else if (mode == 2) {
            pX = radius * Math.sin(i*2)
            pY = radius * Math.cos(i)
        } else if (mode == 3) {
            pX = radius * Math.sin(i)
            pY = radius * Math.cos(i*2)
        } else if (mode == 4) {
            pX = radius * Math.sin(i/2)
            pY = radius * Math.cos(i*2)
            
        } else if (mode == 5) {
            pX = radius / Math.sin(i)
            pY = radius / Math.cos(i)
        } else if (mode == 6) {
            pX = radius / Math.sin(i*2)
            pY = radius / Math.cos(i)
        } else if (mode == 7) {
            pX = radius / Math.sin(i)
            pY = radius / Math.cos(i*2)
        } else if (mode == 8) {
            pX = radius / Math.sin(i/2)
            pY = radius / Math.cos(i*2)
            
        } else if (mode == 9) {
            pX = radius * Math.sin(i)
            pY = radius / Math.cos(i)
        } else if (mode == 10) {
            pX = radius * Math.sin(i*2)
            pY = radius / Math.cos(i)
        } else if (mode == 11) {
            pX = radius * Math.sin(i)
            pY = radius / Math.cos(i*2)
        } else if (mode == 12) {
            pX = radius * Math.sin(i*2)
            pY = radius / Math.cos(i/2)
            
        } else if (mode == 13) {
            pX = radius / Math.sin(i)
            pY = radius * Math.cos(i)
        } else if (mode == 14) {
            pX = radius / Math.sin(i*2)
            pY = radius * Math.cos(i)
        } else if (mode == 15) {
            pX = radius / Math.sin(i)
            pY = radius * Math.cos(i*2)
        } else if (mode == 16) {
            pX = radius / Math.sin(i/2)
            pY = radius * Math.cos(i*2)
            
        } else {
            pX = radius * Math.sin(i)
            pY = radius * Math.cos(i)
        }
        
        pointArr.push([pX,pY])
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

