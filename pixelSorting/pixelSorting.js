// "#232322"
const sSArr = [900, 1080, 1920, 1440, 2560, 1200, 1200]
const can = {w: sSArr[0],h: sSArr[0]}
const half = {w: can.w / 2,h: can.h / 2}

var keyMap = {}; 
onkeydown = onkeyup = function(e){
    keyMap[e.keyCode] = e.type == 'keydown'
    //console.log("key", e.keyCode);
}


let speed=0
let rngColor = getRandomColor()

let sorted

let img
function preload() {
    img = loadImage('/_assets/blackmage.png')
}

//==============================================================================
//  ------------------------------- SETUP --------------------------------------
//==============================================================================
function setup() {
    createCanvas(can.w, can.h/2)
    frameRate(10)
    background(0)
    stroke(255)
    strokeWeight(1)

    createP("")
    sp1 = createSpan("S1").style("marginLeft", "10px")
    sp2 = createSpan("S2").style("marginLeft", "160px")
    sp3 = createSpan("S3").style("marginLeft", "160px")
    sp4 = createSpan("S4").style("marginLeft", "160px")
    createP("<br>")
    s1 = createSlider(1,10,2,1)
    s2 = createSlider(1,50,4,0)
    s3 = createSlider(1,50,5,1)
    s4 = createSlider(1,1000,1,1)

    
    sorted = createImage(img.width, img.height)
    sorted.loadPixels()
    img.loadPixels()

    for (let i = 0; i < sorted.pixels.length; i++) {
        sorted.pixels[i] = img.pixels[i]
    }


    for (let i = 0; i < sorted.pixels.length/2; i++) {
        record = -1
        selectedPixel = i

        for (let j = i; j < sorted.pixels.length/2; j++) {
            pix = color(sorted.pixels[j])
            cc = brightness(pix)

            if ( cc > record) {
                console.log("cc:",cc)
                selectedPixel = j
                record = cc
            }
        }

        tmpPixel = sorted.pixels[i]
        sorted.pixels[i] = sorted.pixels[selectedPixel]
        sorted.pixels[selectedPixel] = sorted.pixels[tmpPixel]
    }


    //sorted.pixels.sort((a,b) => b-a)

    //console.log("red :",hue(color(img.pixels[1])))

    sorted.updatePixels()
    //img.updatePixels()

    console.log("img.length:",img.pixels.length)
    console.log("sorted.length:",sorted.pixels.length)
    console.log("pixels:",sorted.pixels)
}

//==============================================================================
//  ------------------------------- DRAW ---------------------------------------
//==============================================================================
function draw() {    
    //background(0)
    image(sorted, 0,0, width/2,height)
    image(img, width/2,0, width/2,height)

    noLoop()
} // END OF DRAMA

//==============================================================================
//  ------------------------------- FUNCTIONS ----------------------------------
//==============================================================================


// Random Color
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
