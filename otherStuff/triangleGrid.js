let can = {w:600,h:600}
let half = {w:can.w/2,h:can.h/2}
let speed = 0
let step = 1
let triangleSize = (can.w+can.h)/30
let root3 = Math.sqrt(3)
let triSide = triangleSize*2/root3
let uR = root3/3 * (triSide)
let ir = (uR)/2

function setup() {
    createCanvas(can.w, can.h);
    strokeWeight(1)
    angleMode(DEGREES)

}

function draw() {
    background(0);
    //translate(half.w,half.h)

    for (let i = triSide/2; i<width; i += triSide ) {
        for (let j = triSide/2+3; j<height; j += triSide ) {
            push()
            translate(i,j)
            rotate(speed)
            easyTri(0,0,triangleSize)
            pop()
        }
    }

    /*
      circle(half.w,half.h,uR*4)
      push()
      fill("rgba(187, 67, 244, 0.5)")
      noStroke()
      translate(half.w,half.h)
      rotate(speed)
      easyTri(0,0, triangleSize*5)
      pop()
    */

    speed+=step

    if (int(speed) % 60 == 0 && speed != 0) {
        step *= -1
        console.log("ok:")
    }

      //noLoop()
}






function easyTri(x, y, height) {
    let root3 = Math.sqrt(3)
    triangle(
        x, y - root3/3 * (height*2/root3),
        x - (height*2/root3/2), y + (root3/3 * (height*2/root3))/2,
        x + (height*2/root3/2), y + (root3/3 * (height*2/root3))/2
    )
}
