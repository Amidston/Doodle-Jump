const grid = document.querySelector(".grid")
const doodler = document.createElement("div")
const playButton = document.querySelector(".button")
let startPoint = 150
let doodlerLeft = 50
let doodlerBottom = startPoint
let isGameOver = false
let platformCount = 5
let platforms = []
let upTimerId
let downTimerId
let isJump = true
let isLeft = false
let isRight = false
let leftTimerId
let rightTimerId
let score = 0

function createDoodler() {
  grid.appendChild(doodler)
  doodler.classList.add("doodler")
  doodlerLeft = platforms[0].left
  doodlerBottom = platforms[0].bottom + 15
  doodler.style.left = doodlerLeft + "px"
  doodler.style.bottom = doodlerBottom + "px"
}

class Platform {
  constructor(newPlatformBot) {
    this.bottom = newPlatformBot
    this.left = Math.random() * 315
    this.visual = document.createElement("div")

    const visual = this.visual
    visual.classList.add("platform")
    visual.style.left = this.left + "px"
    visual.style.bottom = this.bottom + "px"
    grid.appendChild(visual)
  }
}
function createPlatforms() {
  for (let i = 0; i < platformCount; i++) {
    let platformSpace = 600 / platformCount
    let newPlatformBot = 100 + i * platformSpace
    let newPlatform = new Platform(newPlatformBot)
    platforms.push(newPlatform)
  }
}

function movePlatforms() {
  if (doodlerBottom > 200) {
    platforms.forEach((platform) => {
      platform.bottom -= 4
      let visual = platform.visual
      visual.style.bottom = platform.bottom + "px"
      if (platform.bottom < 0) {
        let firstPlatrform = platforms[0].visual
        firstPlatrform.classList.remove("platform")
        platforms.shift()
        let newPlatform = new Platform(600)
        platforms.push(newPlatform)
        score++
      }
    })
  }
}

function jump() {
  clearInterval(downTimerId)
  isJump = true
  upTimerId = setInterval(function () {
    doodlerBottom += 2
    doodler.style.bottom = doodlerBottom + "px"
    if (doodlerBottom > startPoint + 200) {
      fall()
    }
  }, 0)
}

function fall() {
  clearInterval(upTimerId)
  isJump = false
  downTimerId = setInterval(function () {
    doodlerBottom -= 1
    doodler.style.bottom = doodlerBottom + "px"
    if (doodlerBottom <= 0) {
      gameOver()
    }
    platforms.forEach((platform) => {
      if (
        doodlerBottom + 5 >= platform.bottom &&
        doodlerBottom + 5 <= platform.bottom + 15 &&
        doodlerLeft + 90 >= platform.left &&
        doodlerLeft - 85 <= platform.left &&
        !isJump
      ) {
        startPoint = doodlerBottom
        jump()
      }
    })
  }, 0)
}

function gameOver() {
  isGameOver = true
  while (grid.firstChild) {
    grid.removeChild(grid.firstChild)
  }
  const finalScore = document.createElement("p")
  grid.appendChild(finalScore)
  finalScore.innerHTML = score
  clearInterval(downTimerId)
  clearInterval(upTimerId)
  clearInterval(leftTimerId)
  clearInterval(rightTimerId)
}

function control(e) {
  if (e.key === "ArrowLeft") {
    moveLeft()
  } else if (e.key === "ArrowRight") {
    moveRight()
  }
}

function moveLeft() {
  clearInterval(rightTimerId)
  isLeft = true
  leftTimerId = setInterval(function () {
    if (doodlerLeft >= 0) {
      doodlerLeft -= 1
      doodler.style.left = doodlerLeft + "px"
    }
  }, 0)
}

function moveRight() {
  clearInterval(leftTimerId)
  isRight = true
  rightTimerId = setInterval(function () {
    if (doodlerLeft <= 310) {
      doodlerLeft += 1
      doodler.style.left = doodlerLeft + "px"
    }
  }, 0)
}

function start() {
  grid.innerHTML = ""
  if (!isGameOver) {
    createPlatforms()
    createDoodler()
    setInterval(movePlatforms, 20)
    jump()
    document.addEventListener("keyup", control)
  }
}

playButton.addEventListener("click", start)
