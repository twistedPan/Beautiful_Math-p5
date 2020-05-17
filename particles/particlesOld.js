//"rgb(32, 141, 115)"
class Vector {
    constructor(x,y) {
        this.x = x || 0
        this.y = y || 0
    }
    getDirection() {
        return Math.atan2(this.y, this.x)
    }
    setDirection(direction) {
        var magnitude = this.getMagnitude();
      this.x = Math.cos(angle) * magnitude;
      this.y = Math.sin(angle) * magnitude;
    }
    getMagnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    setMagnitude(magnitude) {
        let direction = this.getDirection(); 
        this.x = Math.cos(direction) * magnitude;
        this.y = Math.sin(direction) * magnitude;
    }
    add(v2) {
        return new Vector(this.x + v2.x, this.y + v2.y);
    }
    addTo(v2) {
        this.x += v2.x;
        this.y += v2.y;
    }
    subtract(v2) {
        return new Vector(this.x - v2.x, this.y - v2.y);
    }
    subtractFrom(v2) {
        this.x -= v2.x;
        this.y -= v2.y;
    }
    multiply(scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    }
    multiplyBy(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }
    divide(scalar) {
        return new Vector(this.x / scalar, this.y / scalar);
    }
    dotProduct(v2) {
        return this.x * v2.x + this.y *v2.y;
    }
    normalize(){
        return new Vector(this.x/(Math.sqrt(this.x * this.x + this.y * this.y)), this.y/(Math.sqrt(this.x * this.x + this.y * this.y)));
    }
    lerp(x, y, amt) { // amt amount of interpolation 0-1
        this.x += (x - this.x) * amt || 0
        this.y += (y - this.y) * amt || 0
        return this;
    }
}
let testVec = new Vector(10,9)


class Particle {
    constructor(x, y, r) {
        this.x = x
        this.y = y
        this.radius = r
        this.speed = random(-1, 3)
        this.color = 0
        this.movingFactor = 0.001
        this.changeTime = 60
    }
    
    update(fc,mode) {
        if(!mode) {
            if (fc % this.changeTime == 0 || fc == 1) {
                rX = random(-this.movingFactor, this.movingFactor)
                rY = random(-this.movingFactor, this.movingFactor)
            }

            xoff = xoff + rX
            yoff = yoff + rY
            let nX = noise(xoff)
            let nY = noise(yoff)

            if(rX > 0) this.x += nX
            else this.x -= nX

            if(rY > 0) this.y += nY
            else this.y -= nY
            
        } else {
            
            this.x += random(-this.speed, this.speed) 
            this.y += random(-this.speed, this.speed)
        }
        
        this.x = constrain(this.x, 0, width)
        this.y = constrain(this.y, 0, height)
        
        this.radius += rX*10
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
        particles[i] = new Particle(width / 2 + random(-i * fac1, i * fac1), 
                                    height / 2 + random(-i * fac1, i * fac1),
                                    3)
        }
    }
}


let particles = []
let particlesCount = 10
let fac1 = 20
let speed = 0
let rngColor = getRandomColor()

let xoff = 0
let yoff = 0
let rX = 0
let rY = 0


let forBool

let checkMode = "flow"
let colorMode
let sliderR
let sliderG
let sliderB
let sliderSizeLine

let sliderMode

let sliderRNGMoving

let col1 = 0
let col2 = 0
let col3 = 0


function setup() {
    var myCan = createCanvas(900, 720)
    canvas = myCan.canvas
    frameRate(60)
    background("rgb(28, 28, 36)")
    stroke(0)
    strokeWeight(3)

    for (let i = 0; i < particlesCount; i++) {
        particles[i] = new Particle(width / 2 + random(-i * fac1, i * fac1),  // keine gute Verteilung
                                    height / 2 + random(-i * fac1, i * fac1), // keine gute Verteilung
                                    3)
    }
    
    
// HTML ELEMENTS ----------------------------------------------------------------------
    createP("")
    resetBtn = createButton("Reset Background")
    resetBtn.elt.style.marginLeft = "10px"
    resetBtn.mousePressed(resetBG)
    
    resetLinesBtn = createButton("Reset Lines")
    resetLinesBtn.elt.style.marginLeft = "10px"
    resetLinesBtn.mousePressed(resetLines)
    
// Size Slider
    sliderSizeLine = createSlider(0.1, 20, 2, 0.1)
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
    sliderMode = createSlider(0, 2, 0,1)
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
    

/*
    createP("<br><br>")
    spanMoving = createSpan("Moving Factor")
    spanMoving.elt.style.marginLeft = "35px"
    sliderRNGMoving = createSlider(-1, 1, 0, 0.01)
    sliderRNGMoving.position(10, 875)
    sliderRNGMoving.style('width', '100px')
*/
// Time Span
    spanTimeInS = createP("")
    spanTimeInS.elt.style.marginLeft = "20px"
    for ( e of document.getElementsByTagName("Input")) {e.style.margin = "10px 15px"}
}


function draw() {
    //fill(255)
    noFill()
    
    let valR = sliderR.value()
    spanR.elt.innerText = "Red " + valR
    let valG = sliderG.value()
    spanG.elt.innerText = "Green " + valG
    let valB = sliderB.value()
    spanB.elt.innerText = "Blue " + valB
    
    let valSize = sliderSizeLine.value()
    spanSize.elt.innerText = "Size: " + valSize
    
    let valSum = sliderSum.value()
    spanSum.elt.innerText = "Sum: " + valSum
    particlesCount = valSum
    
    let valMode = sliderMode.value()
    colorMode.elt.innerText = valMode + " Color Mode - 0=Time (s) / 1=Mouse / 2=Sliders"
    
    checkMode = checkboxMode.child()[0].checked
    
    //let valMovFac = sliderRNGMoving.value()
    //spanMoving.elt.innerText = "Moving Factor = " + valMovFac
    //particles.forEach(e => e.movingFactor = valMovFac)
    
    let s = second()
    let timeMap1 = map(s*2, 0, 120, 125, 255)
    let timeMap2 = map(s*2, 0, 120, 255, 0)
    let timeMap3 = map(s*2, 0, 120, 0, 255)

    let mXMap = map(mouseX, 0, width, 0, 255)
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

    
    //rngDirection(frameCount)
    
    
    console.log()
    
} // END OF DRAMA





function rngDirection(fc) { // frameCount
    if (fc % 60 == 0 || fc == 1) {
        rX = random(0.0001, 0.005)
        rY = random(0.0001, 0.005)
    }
    let x = 100
    let y = 100
    
    xoff = xoff + rX
    yoff = yoff + rY
    nX = noise(xoff) * width
    nY = noise(yoff) * height

    x += nX
    y += nY
    x = constrain(x, 0, width)
    y = constrain(y, 0, height)
    
    //console.log(x,":",y)
    fill(255)
    circle(x, y, 10+nX/20)

    //console.log("nx:",nX, "rx:",rX)

    return [x,y]
}






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










//The derivative of cubic De Casteljau's Algorithm
function DeCasteljausAlgorithmDerivative(t)
{
    let A = 100
    let B = 100
    let C = 800
    let D = 800
    
	let dU = t * t * (-3 * (A - 3 * (B - C) - D))

	dU += t * (6 * (A - 2 * B + C))

	dU += -3 * (A - B) 

	return dU
}

//Get and infinite small length from the derivative of the curve at position t
function GetArcLengthIntegrand(t)
{
	//The derivative at this point (the velocity vector)
	let dPos = DeCasteljausAlgorithmDerivative(t)

	//This the how it looks like in the YouTube videos
	let xx = dPos.x * dPos.x
	let yy = dPos.y * dPos.y
	let zz = dPos.z * dPos.z

	let integrand = Math.sqrt(xx + yy + zz)


	return integrand
}

//Get the length of the curve between two t values with Simpson's rule
function GetLengthSimpsons(tStart, tEnd)
{
	//This is the resolution and has to be even
    let n = 20

	//Now we need to divide the curve into sections
	let delta = (tEnd - tStart) / n

	//The main loop to calculate the length
	
	//Everything multiplied by 1
	let endPoints = GetArcLengthIntegrand(tStart) + GetArcLengthIntegrand(tEnd)

	//Everything multiplied by 4
	let x4 = 0
	for (let i = 1; i < n; i += 2)
	{
		let t = tStart + delta * i

		x4 += GetArcLengthIntegrand(t)
	}

	//Everything multiplied by 2
	let x2 = 0
	for (let i = 2; i < n; i += 2)
	{
		let t = tStart + delta * i

		x2 += GetArcLengthIntegrand(t)
	}

	//The final length
	let length = (delta / 3) * (endPoints + 4 * x4 + 2 * x2)

	return length
}


function FindTValue(d, totalLength)
{
	//Need a start value to make the method start
	//Should obviously be between 0 and 1
	//We can say that a good starting point is the percentage of distance traveled
	//If this start value is not working you can use the Bisection Method to find a start value
	//https://en.wikipedia.org/wiki/Bisection_method
	let t = d / totalLength
    
    

	//Need an error so we know when to stop the iteration
	let error = 0.001

	//We also need to avoid infinite loops
	let iterations = 0

	while (true)
	{
		//Newton's method
		let tNext = t - ((GetLengthSimpsons(0, t) - d) / GetArcLengthIntegrand(t))

		//Have we reached the desired accuracy?
		if (Math.abs(tNext - t) < error)
		{
			break
		}

		t = tNext

		iterations += 1

		if (iterations > 1000)
		{
			break
		}
	}

	return t
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





