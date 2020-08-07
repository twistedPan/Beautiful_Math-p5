let suckoMode = false
let iNeedMoreSpace = false
let txtObj = {
    simarilion: "",
}

let currentTxt = ""
let newTxt = ""

// "rgba(234, 170, 27, 0.46)"
let myWidth = 600
let myHeight = 600

let txtLength = 666
let engramLen = 5

let speed=0,
    rngColor = getRandomColorLight(),
    rngColorA = getRandomColorAlpha(),
    nGramObj = {}

let entities = []
let dist = {x:0,y:0}
let target = {x:0,y:0}
let hypo = 0,
    newX = 0,
    newY = 0,
    player = 0,
    mouseMX = 0,
    mouseMY = 0
;

class Figure {
    constructor(x,y,r) {
        this.x=x
        this.y=y
        this.origin = {x:this.x,y:this.y}
        this.radius=r
        this.diameter=2*r
        this.speed = random(0.1,4)
        this.color = "#000000" //getRandomColor()
        this.buffer = 50
        this.text = "default"
        this.txtSize = 0
    }
    update(dir) {
        dist.x = calcAbsPtoM(this, {x:target.x, y:target.y}).x
        dist.y = calcAbsPtoM(this, {x:target.x, y:target.y}).y
        hypo = calcHypPtoM(this, {x:target.x, y:target.y})
        if (suckoMode || iNeedMoreSpace) {
            newX = dist.x/25 * this.speed
            newY = dist.y/25 * this.speed

            if (iNeedMoreSpace) {
                this.x += newX*1.2;
                this.y += newY*1.2;
            } else {
                this.x -= newX*1.2;
                this.y -= newY*1.2;
            }

        } else {
            newX = ((this.buffer * ((dist.x / Math.abs(dist.x))) + dist.x)) / 20 * this.speed
            newY = ((this.buffer * ((dist.y / Math.abs(dist.y))) + dist.y)) / 20 * this.speed
            
            //spawn off screen
            if (this.x > width)  this.x = (width/2) * rngBetween(-2,2)
            else if (this.x < 0) this.x = (width/2) * rngBetween(-2,2)
            if (this.y > height) this.y = (height/2) * rngBetween(-2,2)
            else if (this.y < 0) this.y = (height/2) * rngBetween(-2,2)
            
            if (hypo < this.radius+this.buffer) {
                //console.log(dist.x)
                if (!isNaN(newX)) 
                this.x += newX 
                if (!isNaN(newY)) 
                this.y += newY
                
        }
            
            //console.log("x",entities[216].x,"y" ,entities[216].y)
        }
        //entities.sort(function(a,b) {return a.x - b.x})
    }
    display(type) {
        if(type) ellipse(this.x, this.y, this.diameter)    //drawCross(this,10)
        else if (this.text !== "default"){
            push()
                fill(this.color)
                textSize(this.textSize)
                text(this.text,this.x, this.y, this.diameter);
            pop()
        }
    }
    reset() {
        //this.x = Math.random()*width
        //this.y = Math.random()*height
        this.x = this.origin.x
        this.y = this.origin.y
        this.speed = random(0.3,1)
    }
}


function preload() {
    txtObj.simarilion = loadStrings('assets/simarilion.txt')
}
//===============================================================================
//  ------------------------------- SETUP ---------------------------------
//===============================================================================
function setup() {
    let myCan = createCanvas(myWidth, myHeight)
    frameRate(60)
    background(0)
    textSize(13)
    angleMode(DEGREES)

    createP("")
    createSpan("W, A, S, D - click to reset - space to pull - crtl to push").style("marginLeft","10px")
    createSpan("<br><br>")

    for (ele in txtObj) {
        removeChar(ele,'“')
        removeChar(ele,'„')
        removeChar(ele,' –')
    }

// Text
    listSimaWordsArr = listWordsInText(txtObj.simarilion) // Simarilion List
    currentTxt = markovTxt(txtObj.simarilion[0],engramLen, txtLength)
    let textArr = currentTxt.split(" ")

// Points
    let max = {i:15,j:8}
    for (let i = 0; i < max.i; i++) {
        for (let j = 0; j < max.j; j++) {
            entities.push(new Figure(j*(width/max.j)+10,i*(height/max.i)+10, 10))
        }
    }
    for (let i = 0; i<textArr.length; i++) {
        entities[i].text = textArr[i]
        entities[i].txtSize = Math.floor(rngBetween(10,16))
    }
    player = new Figure(width/2, height/2, 5)

    createP(currentTxt).style("width","600px").style("marginLeft", "10px")
}


//===============================================================================
//  ------------------------------- DRAW ---------------------------------
//===============================================================================
function draw() {
    background(245)
    fill(rngColor)
    stroke(0)
    strokeWeight(2)
    noStroke()

    fill("#1a151a")

    target.x = player.x
    target.y = player.y
    mouseMX = map(target.x, 0,width, -(width/2),width/2)
    mouseMY = map(target.y, 0,height, -(height/2),height/2)

    entities.forEach(e => e.display() + e.update())
    player.display("cross")
    controller(5)

    //noLoop()
} // END OF DRAMA

//===============================================================================
//  ------------------------------- FUNCTIONS ---------------------------------
//===============================================================================

function mouseClicked() {
    entities.forEach(e => e.reset())
    return false;
}

// MARKOV

function getNGram(textString, n) {
    let engramArr = []
    for (let i=0; i<textString.length-n; i++) {
        let gram = textString.slice(i,i+n)
        
        if (!nGramObj[gram]) {
            nGramObj[gram] = []
        } 
        nGramObj[gram].push(textString.charAt(i+n))
        
        engramArr.push(gram)
    }
    return nGramObj
}


function markovTxt(txt,n,sLen) {
    let nGramObj = getNGram(txt,n)
    let currentGram = txt.slice(0,n)
    currentGram = getRandomNGram("u",n)
    while(typeof nGramObj[currentGram] === "undefined") {
        currentGram = getRandomNGram("u",n)
    }
    let result = currentGram
    
    for (let i=0; i<sLen; i++) {
        let possibilities = nGramObj[currentGram]
        let nextChar = possibilities[Math.round(rngBetween(0,possibilities.length-1))]
        result += nextChar
        let len = result.length
        currentGram = result.slice(len-n,len)
        while(typeof nGramObj[currentGram] === "undefined") {
            currentGram = getRandomNGram("l",n)
        }
        //console.log("RESULT|",result,"|CURRENT|", currentGram, "|NEXTCHAR|", nextChar)
    }
    
    //console.log(result)
    return result
}


function getRandomNGram(letterCase,n) {
    upLArr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
    loLArr = "abcdefghijklmnopqrstuvwxyz".split("")
    loVArr = "aeiou".split("")
    nGram = ""
    
    if (letterCase == "u") {
        nGram += upLArr[Math.round(Math.random()*(upLArr.length-1))]
        for (let i=0; i<n-1; i++) {
            nGram += loLArr[Math.round(Math.random()*(upLArr.length-1))]
        }
    }
    else if (letterCase == "l") {
        for (let i=0; i<n; i++) {
            nGram += loLArr[Math.round(Math.random()*(upLArr.length-1))]
        }
    }
    return nGram
}


// Split text with choosen regex, retrun splitted Text as Array
function splitText(textString,regex) {
    if (typeof textString === "object") textString = textString.join("")
    let splitTextArr = textString.split(regex) // Füllt ein Array, unterteilt nach SPACES
    return splitTextArr
}

// Returns 2D Array with Arrays of the same word in Array
function listWordsInText(textString) {
    let strArr = splitText(textString,' ')
    //console.log("TEEEEEEST:", strArr)
    let wordListArr = []
    while (strArr.length > 0) {
        wordListArr.push(findWord(strArr[0], strArr))
    }
    return wordListArr
}
// Returns Array with Key(Word) and Value(Count)
function mapWordsInText(textString) {
    let wordListArr = listWordsInText(textString)
    let wordMap = new Map()
    let wordString = ""
    for (let i in wordListArr) {
        wordString = wordListArr[i][0]
        wordMap.set(wordString, wordListArr[i].length) // <- Map
        //wordMap[wordString] = wordListArr[i].length // <- assoziativer Array
    }
    return wordMap
}
/*
// COMPACT VERSION
function createWordCountMap(textString) {
    let wordListArr = []
    let wordMap = new Map()
    let splitTextArr = textString.split(' ') // Füllt ein Array, unterteilt nach SPACES
    
    // put same words together in 2D array
    while (splitTextArr.length > 0) {
        wordListArr.push(findWord(splitTextArr[0], splitTextArr))
    }
    // Create Map with WordString : count
    for (let i in wordListArr) {
        wordString = wordListArr[i][0]
        wordMap.set(wordString, wordListArr[i].length) // <- Map
        //wordMap[wordString] = wordListArr[i].length // <- assoziativer Array
    }
    return wordMap
}
*/

// Find specific 'word' in Array 'strArr'
function findWord(word,strArr) {
    let wordArr = []
    while (strArr.includes(word)) { // run as long as 'word' is in StringArray
        wordArr.push(strArr.splice(strArr.indexOf(word), 1)[0])
    }
    return wordArr
}

function removeChar(txt,char) {
    return txt.split(char).join('')
}
function replaceChar(txt,char,newChar) {
    return txt.split(char).join(newChar)
}




// HELPER

function rngBetween(min,max) {
    return (Math.round((Math.random() * (max - min) + min)*100))/100
}

function calcAbsPtoM(obj, point) {
    return {x:(obj.x - point.x) , y:(obj.y - point.y)}
}
function calcHypPtoM(obj, point) {
    let x = obj.x - point.x
    let y = obj.y - point.y
    return Math.sqrt((x*x + y*y),2)
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
function getRandomColorLight() {
    let letters = '89ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 8)];
    }
    return color;
}
function getRandomColorAlpha() {
    let color = '';
    r = Math.floor(rngBetween(100,255))
    g = Math.floor(rngBetween(180,255))
    b = Math.floor(rngBetween(180,255))
    a = rngBetween(0.5,1)
    return "rgba("+r+","+g+","+b+","+a+")"
}

function controller(speed) {
    
    if (keyIsDown(37) || keyIsDown(65)) { // arrow left 37 a
        if(player.x > 0) player.x -= speed
    }
    if (keyIsDown(39) || keyIsDown(68)) { // arrow right 39 d
        if(player.x < width) player.x += speed
    }
    if (keyIsDown(38) || keyIsDown(87)) { // arrow up 38 w
        if(player.y > 0) player.y -= speed
    }
    if (keyIsDown(40) || keyIsDown(83)) { // arrow down 40 s
        if(player.y < height) player.y += speed
    }
    if (keyIsDown(32)) {
        suckoMode = true
    } else suckoMode = false
    if (keyIsDown(17)) {
        iNeedMoreSpace = true
    } else iNeedMoreSpace = false
}