
let txtObj = {
    dante: "",
    ff7: "",
    hitler: "",
    kdh: "",
    simarilion: "",
}

let currentTxt = ""
let newTxt = ""

// "rgba(234, 170, 27, 0.46)"
let sSArr = [700, 1000, 1080, 1920, 1440, 2560, 1200, 1200]
let myWidth = sSArr[0]
let myHeight = sSArr[0]
let startValues = [myWidth,myHeight]

let speed=0,
    rngColor = getRandomColorLight(),
    rngColorA = getRandomColorAlpha(),
    nGramObj = {}


function preload() {
    
    txtObj.dante = loadStrings('../assets/txt/dante.txt')
    txtObj.ff7 = loadStrings('../assets/txt/ff7.txt')
    txtObj.hitler = loadStrings('../assets/txt/hitler.txt')
    txtObj.kdh = loadStrings('../assets/txt/kdh.txt')
    txtObj.simarilion = loadStrings('../assets/txt/simarilion.txt')

    txtArr = [

    ]

    //for (ele in txtObj) console.log(":",ele) // names of text
    //for (ele in txtObj) console.log(":",typeof ele) // STRING
}


//===============================================================================
//  ------------------------------- SETUP ---------------------------------
//===============================================================================
function setup() {
    let myCan = createCanvas(myWidth, myHeight)
    frameRate(60)
    background(0)
    textSize(10)
    angleMode(DEGREES)
    
    createP("")
    ss = createSlider(0,360,180,1)
    
    ts = createSelect()
    ts.option('KDH','kdh')
    ts.option('Hitler ','hitler')
    ts.option('FF7','ff7')
    ts.option('Simarilion ','simarilion')
    ts.option('Göttliche Komödie','dante')
    
    btn = createButton('change BG')
    btn.style('marginLeft', '10px')
    btn.mousePressed(resetBG)
    
    for (ele in txtObj) {
        removeChar(ele,'“')
        removeChar(ele,'„')
        removeChar(ele,' –')
    }

    /*
    console.log("Differend Words dante:",listWordsInText(txtObj.dante).length)
    console.log("Text dante:",txtObj.dante[0].length)
    console.log("Differend Words hitler:",listWordsInText(txtObj.hitler).length)
    console.log("Text hitler:",txtObj.hitler[0].length)
    console.log("Differend Words kdh:",listWordsInText(txtObj.kdh).length)
    console.log("Text kdh:",txtObj.kdh[0].length)
    console.log("Differend Words ff7:",listWordsInText(txtObj.ff7).length)
    console.log("Text ff7:",txtObj.ff7[0].length)
    console.log("Differend Words sima:",listWordsInText(txtObj.simarilion).length)
    console.log("Text simarilion:",txtObj.simarilion[0].length)
    */

    listSimaWordsArr = listWordsInText(txtObj.simarilion) // Simarilion List
    //console.log("List:",listSimaWordsArr, typeof listSimaWordsArr)
    
    
    // Map.forEach(console.log(function))
    // for..of ->  for (variable of iterable) console.log(variable)
    // for..in ->  for (variable in object) console.log(object[variable])

}


//===============================================================================
//  ------------------------------- DRAW ---------------------------------
//===============================================================================
function draw() {
    //background(random()*255,random()*255,random()*255)
    background("rgb(253, 237, 220)")
    background(rngColorA)
    fill(rngColor)
    //fill("#1d162c")
    stroke(0)
    strokeWeight(2)
    //noFill()
    noStroke()
    
    //btn.mousePressed(resetBG())

    let sValue = ss.value()
    let tsValue = ts.value()
    let sW = width/2
    let sH = height/2
    translate(sW,sH)
    let radius = width/2.2
    

    push()
    textSize(10)
    fill("rgba(185, 175, 185, 0.21)")
    for (let i=0; i<listSimaWordsArr.length/2; i++) {
        text(listSimaWordsArr[i], (radius/1.2)*cos(i), (radius/1.2)*sin(i))
        rotate(sValue/listSimaWordsArr.length)
    }
    pop()


    textSize(20)
    let txtLength = 1000
    let engramLen = 5
    fill("#1a151a")

    if (newTxt != tsValue) {
        /*
        if (tsValue == "simarilion")
            currentTxt = markovTxt(txtObj.simarilion[0],engramLen, txtLength)
        else if (tsValue == "kdh")
            currentTxt = markovTxt(txtObj.kdh[0],engramLen, txtLength)
        else if (tsValue == "hitler")
            currentTxt = markovTxt(txtObj.hitler[0],engramLen, txtLength)
        else if (tsValue == "ff7")
            currentTxt = markovTxt(txtObj.ff7[0],engramLen, txtLength)
        else 
            currentTxt = markovTxt(txtObj.simarilion[0],engramLen, txtLength)
            */
           currentTxt = markovTxt(txtObj.simarilion[0],engramLen, txtLength)
    }
    text(currentTxt, -radius,-radius, radius*2,radius*2)
    newTxt = tsValue

    //console.log(markovTxt(txtObj.simarilion,3))
    //console.log(getRandomNGram(1)+getRandomNGram())
    
    speed += 0.1
    
    //noLoop()
} // END OF DRAMA

//===============================================================================
//  ------------------------------- FUNCTIONS ---------------------------------
//===============================================================================

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
    //console.log(nGramObj)
    //return engramArr
    return nGramObj
}


function markovTxt(txt,n,sLen) {
    let nGramObj = getNGram(txt,n)
    let currentGram = txt.slice(0,n)
    //currentGram = getRandomNGram("u",n)
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
    
    console.log(result)
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

function rngBetween(min,max) {
    return (Math.round((Math.random() * (max - min) + min)*100))/100
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

function resetBG() {
    rngColorA = getRandomColorAlpha()
}
// "rgba(234, 170, 27, 0.46)"
// Math.floor(Math.random()*255)

