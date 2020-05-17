let can = {
    w: 800,
    h: 800
}
let half = {
    w: can.w / 2,
    h: can.h / 2
}

let movement = 0
let step = 0.1
let reduce = 0
let alphaMap = 255
let allIn

function setup() {
    canvas = createCanvas(can.w, can.h);
    strokeWeight(0.4)
    angleMode(DEGREES)
    frameRate(60)
    rectMode(CENTER)
{   // HTML ELEMENTS

    container = createDiv("")
    sInteration = createSlider(0.1, 100, 20.1, step).parent(container)
    sShrink = createSlider(0, 100, 2, 0.5).parent(container)
    sAlpha = createSlider(0, 254, 200, 1).parent(container)
    //s??? = createSlider(0, 304, 200, 1).parent(container)
    for (e of [sInteration,sShrink,sAlpha]) e.style("width","80px")
    createP("").parent(container)
    sInterationP = createSpan("").parent(container)
    sInterationP.style("marginLeft", "10px")
    sShrinkP = createSpan("").parent(container)
    sShrinkP.style("marginLeft", "20px")
    sAlphaP = createSpan("").parent(container)
    sAlphaP.style("marginLeft", "45px")
    createP("<br>").parent(container)
    selMode = createSelect().parent(container).style("marginLeft","10px")
    selMode.option('Triangle',1);
    selMode.option('Rectangle',2);
    selMode.option('Elipse',3);
    selMode.option('Line',4);
    transMode = createCheckbox("Transparent Background",false).style("marginTop","5px").parent(container)
    colorPicker = createColorPicker('#0aff00').parent(container)
    colorPicker.position(120, can.h + 60)
    colorPicker.style('width', '60px')

    container.style("marginLeft","0px")

    checkboxAnim = createCheckbox('animate Elements', false);
    checkboxAnim.style("marginTop", "5px")

    createSpan("")
    animSpan1 = createSpan("Animate from")
    animSpan1.class("animBlock")
    start_V = createInput("1")
    start_V.style('width', '40px')
    start_V.class("animBlock")
    animSpan2 = createSpan("to")
    animSpan2.class("animBlock")
    end_V = createInput("20")
    end_V.style('width', '40px')
    end_V.class("animBlock")
    animSpan2 = createSpan("steps of ")
    animSpan2.class("animBlock")
    step_V = createInput("1")
    step_V.style('width', '20px')
    step_V.class("animBlock")
    animBlock = document.getElementsByClassName("animBlock");
    for (e of animBlock) {e.style.display = "none"
                          e.style.margin = "2px"}
}

}


function draw() {
    if(!transMode.child()[0].checked) background("rgba(17, 6, 24, 1)");
    noFill()
    translate(half.w, half.h)
    //console.log("bb",selectAll("input"))

    //console.log(colorPicker)
    if (checkboxAnim.child()[0].checked) {
        for (e of animBlock) {e.style.display = "inline"}
        sInteration_V = jumpBetween(sInteration_V,
            parseInt(start_V.value()),
            parseInt(end_V.value()),
            parseInt(step_V.value()))
    } else sInteration_V = sInteration.value()
    sInterationP.elt.innerText = "Iteration: " + sInteration_V
    let sShrink_V = sShrink.value()
    sShrinkP.elt.innerText = "Shrink: " + sShrink_V
    let sAlpha_V = sAlpha.value()
    sAlphaP.elt.innerText = "Alpha: " + sAlpha_V
    let mode = selMode.value()
    let sColor = colorPicker.color()
    //console.log(sColor)


    for (let i = 0; i < sInteration_V; i += 0.1) {
        alphaMap = map(i, 0, sInteration_V, sAlpha_V, 255)
        push()
        stroke(sColor.levels[0],sColor.levels[1],sColor.levels[2],alphaMap)
        switch (mode) {
            case "1":
                easyTri(0, 0,(can.w * 0.7) - i * sShrink_V)
                break;
            case "2":
                rect(0,0,(can.w * 0.7) - i * sShrink_V)
                break;
            case "3":
                ellipse(0,0,(can.w * 0.7) - i * sShrink_V,(can.w * 0.7) - i * sShrink_V/2)
                break;
            case "4":
                line(0,0,(can.w * 0.7) - i * sShrink_V,((can.w * 0.7) - i * sShrink_V)/2)
                break;
            default:
            easyTri(0, 0, (can.w * 0.7) - i * sShrink_V)
        }
        pop()

        rotate(sInteration_V)

        //rotate(int(movement*10)/10)
    }


    //console.log()
    //console.log("movement:",int(movement*10), "s_V:",sInteration_V)


    //movement+=step
    //if (int(movement*10) == 60 || int(movement*10) < 0) {
    //  console.log("movement:",int(movement*10))
    //  step *= -1
    //}

    //if (frameCount == 120)noLoop()
}

let klickBool = false
function jumpBetween(value,a,b,step) {
    a = a || 1
    b = b || 1
    step = step / 100
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


function easyTri(x, y, height) {
    let root3 = Math.sqrt(3)
    triangle(
        x, y - root3 / 3 * (height * 2 / root3),
        x - (height * 2 / root3 / 2), y + (root3 / 3 * (height * 2 / root3)) / 2,
        x + (height * 2 / root3 / 2), y + (root3 / 3 * (height * 2 / root3)) / 2
    )
}
