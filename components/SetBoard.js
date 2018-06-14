// SetBoard.js

var timerText = document.getElementById("timerText");
var numberOfLegalSquares = 0;
var playerTimer;
var seconds = 0;
var minutes = 0;
var hours = 0; 

var neighborOffsets = [
  [-1, -1], [-1, 0], [-1, 1], [0, -1],/*,['0, 0'],*/ [0, 1], [1, -1], [1, 0], [1, 1],
];

var squareDecoration = {
  "bomb": { "color": 'red', "text": '*'},
  // 'official colors'
  0: { "color": 'white'},
  1: { "color": 'blue' },
  2: { "color": 'green' },
  3: { "color": 'red' },
  4: { "color": 'purple' },
  5: { "color": 'maroon' },
  6: { "color": 'turquoise' },
  7: { "color": 'black' },
  8: { "color": 'gray'}
}

// named export - genGuiPlaceBombs
var genGuiPlaceBombs = function (lastRow, lastCol, numOfBombs) {
  let numberOfBombsPlaced = 0;
  console.log('numOfBombs to be placed = ' + numOfBombs);
  while ( numberOfBombsPlaced < numOfBombs ) {
    var randomRow = Math.floor(Math.random() * lastRow);
    var randomCol = Math.floor(Math.random() * lastCol);
    var randomGameSquare = document.getElementById(`text-id-row${randomRow}col${randomCol}`);
    // avoid placing on squares that are already bombs, throws off the bomb count
    if ( randomGameSquare.innerHTML !== '*' ) {
       // place text bombs
      randomGameSquare.setAttribute("fill", `${squareDecoration.bomb.color}`);
      randomGameSquare.innerHTML = `${squareDecoration.bomb.text}`;
      numberOfBombsPlaced++;
    } 
  }
}

// named export - genGuiPlaceNumbers
var genGuiPlaceNumbers = function (lastRow, lastCol) {
  // once bombs are laid, place numbers so Gameplay.js just consists of:
  // clicking, square clearing, single square clear, and or game over

  // look at every square on the board
  // if that square has a bomb, skip, and run neighbor check on next square.
  // skip again if it's a bomb and so on...
  var i;
  var textSquares = document.getElementsByClassName("text-squares");
  for ( i = 0; i < textSquares.length; i++ ) {
    var numberOfBombs = 0;
    var squareRowIndex = textSquares[i].getAttribute('data-rowIndex');
    var squareColIndex = textSquares[i].getAttribute('data-colIndex');
    // convert squareRow/ColIndex from string to int
    squareRowIndex = parseInt(squareRowIndex, 10);
    squareColIndex = parseInt(squareColIndex, 10);
    neighborOffsets.forEach(offset => {
      // first thing we want to do is check if the innerHTML on current 
      // iteration is a *, if it is, we can skip for now since we are just
      // placing the numbers.
      if ( textSquares[i].innerHTML === '*' ){
        //console.log('bomb found on ' + textSquares[i] + ' ... skipping');
      } else {
          // iterates through each array element referencing each of it's properties,
          // 0,1. +1 to whatever that index happens to be
          var neighborRowIndex = squareRowIndex + offset[0];
          var neighborColumnIndex = squareColIndex + offset[1];
          if (neighborRowIndex >= 0 && neighborRowIndex < lastRow && neighborColumnIndex >= 0 && neighborColumnIndex < lastCol) {
            var checkingSquare = document.getElementById(`text-id-row${neighborRowIndex}col${neighborColumnIndex}`);

            // if the tile is valid aka not "off the board"
            if (checkingSquare.innerHTML === '*') {
              numberOfBombs++;
             }
          }
        }
      });
      // write value to tile
      var placeNumber = numberOfBombs;
      var placeColor = squareDecoration[placeNumber].color;
      if ( placeNumber >= 1 ) {
      textSquares[i].innerHTML = `${placeNumber}`;
      textSquares[i].setAttribute("fill", `${placeColor}`)
      }
  }
}

var genGuiPlayerHUD = function(submitButton) {

  function genGuiPlaceGameReset(submitButton) {
    // replace game selection form with a reset button for now
    var resetButton = document.createElement("button");
    resetButton.setAttribute("id","resetButton");
     // for now, reset button will refresh page but not remove gamedata
    resetButton.setAttribute("onclick", "location.reload();");
    resetButton.setAttribute("onmouseover", "this.style.borderWidth='2px'; this.style.borderColor='#2c549ad4';");
    resetButton.setAttribute("onmouseout", "this.style.borderWidth='2px'; this.style.borderColor='#dcdcdc';");
    resetButton.setAttribute("value","restart game");
    resetButton.innerHTML = 'reset';
    document.getElementsByClassName("sizeSelectionText")[0].style.display = 'none';
    // submitButton = htmlfrom -- so this replaces the entire intro form
    submitButton.parentNode.replaceChild(resetButton, submitButton);
  }
  
  function genGuiPlaceTimer() {
    timerText.innerHTML = `${hours}:${minutes}:${seconds}`;
  }

  genGuiPlaceGameReset(submitButton);
  genGuiPlaceTimer();
  timerOperations('on');
}

var ensureLeaderStatsObjIsAlive = function() {
  // pull current JSON from localsStorage and test
  var leaderStatsObject = JSON.parse(localStorage.getItem('leaderStatsObject'));
  if ( leaderStatsObject === null ) {
    // if null, recreate and populate with base JSON structure
    leaderStatsObject = {};
    console.log('storage object found null ' + leaderStatsObject);
    for ( let i = 0; i < document.getElementsByClassName("leaderRow").length; i++ ) {
      leaderStatsObject[`game${i}`] = [ 'TBD','TBD', '10:0:0', 'TBD'];
    }
    // ensure that it's in an array format sending to localStorage as JSON
    var sendLeaderStatsObject = Object.values(leaderStatsObject);
    localStorage.setItem( 'leaderStatsObject', JSON.stringify( sendLeaderStatsObject ) );
  } 
  return leaderStatsObject;
}

var getNumberOfLegalSquares = function() {
  var textSquares = document.getElementsByClassName('text-squares');
  for ( let i = 0; i !== textSquares.length; i++ ) {
    if ( textSquares[i].innerHTML !== "*" ) {
      numberOfLegalSquares+=1;
    }
  }
  return numberOfLegalSquares;
}

var genGuiLegalSquaresRemaining = function() {
  var textSquares = document.getElementsByClassName('text-squares');
  var legalSquaresRemainingVal = 0;
  var uncoveredSquares = 0;
  for ( let i = 0; i < textSquares.length; i++ ) {
    if ( textSquares[i].innerHTML !== "*" && textSquares[i].getAttribute('fill-opacity') === '1.0' ) {
      uncoveredSquares+=1;
    }
  }
  legalSquaresRemainingVal = numberOfLegalSquares - uncoveredSquares;
  return legalSquaresRemainingVal;
}

var timerOperations = function(toggle) {
  
  var timerToggle = toggle;
  
  function startTimer() {
    seconds+= 1;
    if (seconds === 60 ){
      seconds = 0;
      minutes+= 1;
    }
    if (minutes === 60) {
      minutes = 0;
      hours+=1;
    }
    timerText.innerHTML = `${hours}:${minutes}:${seconds}`;
  }
  
  if ( timerToggle === 'on' ) {
    document.getElementsByClassName("timerElements")[0].style.display = 'grid';
    playerTimer = setInterval(function() {
      startTimer();
    }, 1000);
    return playerTimer;
  }

  if ( timerToggle === 'off' ) {
    var timeFinished = `${hours}:${minutes}:${seconds}`;
    clearInterval(playerTimer);
    return timeFinished;
  }

}

export { 
  genGuiPlaceBombs, 
  genGuiPlaceNumbers, 
  genGuiPlayerHUD, 
  timerOperations, 
  getNumberOfLegalSquares, 
  genGuiLegalSquaresRemaining, 
  ensureLeaderStatsObjIsAlive 
};
