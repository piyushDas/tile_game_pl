let moves = 0
let undoCount = 0
let currentUndoIndex = 0
let gameStarted = false

const generateTiles = (row, col, type) => {
  if (gameStarted) {
    return
  }
  const levels = document.getElementsByClassName('level')
  for (let index = 0; index < levels.length; index++) {
    levels[index].classList.remove('select-level')
  }
  document.getElementById(type).classList.add('set-level')
  gameStarted = true
  const tileBox = document.getElementById('tile-box')
  tileBox.innerHTML = ''
  let tileValues = []
  for (let index = 1; index < row*col; index++) {
    tileValues.push(index)
  }
  tileValues.push('')
  tileValues = shuffleTiles(tileValues)
  for (let rowIndex = 0; rowIndex < row; rowIndex++) {
    let tileRow = ''
    for (let colIndex = 0; colIndex < col; colIndex++) {
      let emptyClass = ''
      if (!tileValues[rowIndex*col + colIndex]){
        emptyClass = 'empty'
      }
      tileRow += `<div class="tile ${emptyClass}" id="index_${rowIndex}_${colIndex}" onClick="slideTile('index_${rowIndex}_${colIndex}')">${tileValues[rowIndex*col + colIndex]}</div>`
    }
    tileBox.innerHTML += `<div class="tile-row">${tileRow}</div>`
  }
}

const shuffleTiles = array => {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

const updateUndoIndex = () => {
  const list = document.getElementById('moves-list')
  currentUndoIndex = list.children.length - 5
}

const logMove = (oldTile, newTile) => {
  const oldtTileIndex = oldTile.id.split('_')
  const newtTileIndex = newTile.id.split('_')
  const list = document.getElementById('moves-list')
  const listItem = `<li> Move tile from <span>${oldtTileIndex[1]}, ${oldtTileIndex[2]}</span> to <span>${newtTileIndex[1]}, ${newtTileIndex[2]}</span></li>`
  list.innerHTML += listItem
  updateUndoIndex()
}

const swapWithEmptyTile = (oldTile, newTile, undoFlag) => {
  newTile.innerText = oldTile.innerText
  newTile.classList.remove('empty')
  oldTile.innerText = ''
  oldTile.classList.add('empty')
  if (undoFlag) {
    const list  =  document.getElementById('moves-list')
    list.removeChild(list.lastChild)
  } else {
    logMove(oldTile, newTile)
  }
}

const findEmptyTileFor = tile => {
  const tileIndex = tile.id.split('_')
  const nextTile = document.getElementById(`${tileIndex[0]}_${tileIndex[1]}_${parseInt(tileIndex[2]) + 1}`)
  const prevTile = document.getElementById(`${tileIndex[0]}_${tileIndex[1]}_${parseInt(tileIndex[2]) - 1}`)
  const aboveTile = document.getElementById(`${tileIndex[0]}_${parseInt(tileIndex[1]) - 1}_${tileIndex[2]}`)
  const belowTile = document.getElementById(`${tileIndex[0]}_${parseInt(tileIndex[1]) + 1}_${tileIndex[2]}`)
  let validMove = false
  if (nextTile && !nextTile.innerText) {
    validMove = true
    swapWithEmptyTile(tile, nextTile)
  } else if (prevTile && !prevTile.innerText) {
    validMove = true
    swapWithEmptyTile(tile, prevTile)
  } else if (aboveTile && !aboveTile.innerText) {
    validMove= true
    swapWithEmptyTile(tile, aboveTile)
  } else if (belowTile && !belowTile.innerText) {
    validMove = true
    swapWithEmptyTile(tile, belowTile)
  }
  verifyResults(validMove)
}

const verifyResults = validMove => {
  const tileEls = document.getElementsByClassName('tile')
  let correctValues = []
  let userValues = []
  for (let index = 0; index < tileEls.length; index++) {
    correctValues.push(index+1)
    userValues.push(tileEls[index].innerText)
  }
  correctValues[correctValues.length - 1] = ""
  correctValues = correctValues.join('_')
  userValues = userValues.join('_')
  if (correctValues === userValues && validMove) {
    setTimeout(() => {
      newgame()
      alert ("You win")
    }, 500)
  } else if (correctValues !== userValues && validMove){
    moves += 1
    document.getElementById('moves-count').innerText = moves
  }
}

const slideTile = id => {
  let currentTile = document.getElementById(id)
  findEmptyTileFor(currentTile)
  undoCount = 0
}

const undoMove = () => {
  const list  =  document.getElementById('moves-list')
  if (list.children.length && undoCount < 5 && list.children.length > currentUndoIndex) {
    undoCount += 1
    const oldCoords = list.lastChild.children[0].innerText.split(', ').join('_')
    const newCoords = list.lastChild.children[1].innerText.split(', ').join('_')
    const oldTile = document.getElementById(`index_${newCoords}`)
    const newTile = document.getElementById(`index_${oldCoords}`)
    swapWithEmptyTile(oldTile, newTile, true)
  }
}

const newgame = () => {
  const levels = document.getElementsByClassName('level')
  for (let index = 0; index < levels.length; index++) {
    levels[index].classList.add('select-level')
    levels[index].classList.remove('set-level')
  }
  const tileBox = document.getElementById('tile-box')
  tileBox.innerHTML = ''
  gameStarted = false
  document.getElementById('moves-list').innerHTML = ''
}

newgame()