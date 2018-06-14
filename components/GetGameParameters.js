// GetGameParameters.js

import { ensureLeaderStatsObjIsAlive } from './SetBoard.js';

var sheetType = document.getElementById("websweepStyle").getAttribute("href");

// submitButton = named export
var submitButton = document.getElementById('htmlform');

// Page loading too quicky sometimes, so I created an event listener for DOMContentLoaded.
document.addEventListener('DOMContentLoaded', function() {
    addFormListener();
});

function addFormListener() {
  // first initialize localStorage handlers/data/leaderboard
  // use to set or get playerName default for homepage
  localStorage.getItem('playerName') || localStorage.setItem('playerName', 'HelloPlayer');
  document.getElementById('playerName').value = localStorage.getItem('playerName');
  localStorage.getItem('datePlayed') || localStorage.setItem('datePlayed', 'TBD');
  localStorage.getItem('timeFinished') || localStorage.setItem('timeFinished', 'TBD');
  ensureLeaderStatsObjIsAlive();
  getAndPlaceLeaders();
  
  // hide squaresLeft counter
  document.getElementById("legalSquaresLeft").style.display = 'none';

  // also required an anonymous function to prevent auto executing here...
  submitButton.addEventListener('submit', function() {
    for (let i = 0; i < submitButton.length; i++) {
      if (submitButton[i].checked) {
        determineGameParams(submitButton[i].value)
      }
    }
  },false)
}

// named export
function getAndPlaceLeaders() {
  // update, "render", leaderBoard
  var getCurrentLeaders = JSON.parse(localStorage.getItem('leaderStatsObject'));
  var gameElemIndex = 0;
  if (getCurrentLeaders) {
    getCurrentLeaders.forEach(leader => {
      var leaderRowElem = document.getElementsByClassName('leaderRow')[gameElemIndex];
      var textElemVar = document.createElement("text");
      leaderRowElem.appendChild(textElemVar);
      textElemVar.append(`${leader[0]}, ${leader[1]}, ${leader[2]}, ${leader[3]}`);
      // assume un-hide
      leaderRowElem.style.display = 'block';
      // hide if TBD values ... 
      if ( leader[0] == "TBD" || leader[1] == "TBD" ) {
        leaderRowElem.style.display = 'none';
      }
      gameElemIndex+=1;
    });
  }
}

// gameParams = named export
var gameParams = {};
function determineGameParams(value) {
  // gameParams TBD below
  sheetType = document.getElementById("websweepStyle").getAttribute("href");
  gameParams = { size: value, lastRow: 0, lastCol: 0, numOfBombs: 0, width: 0, height: 0, 'sheetType': sheetType };
  if ( value === 'Large' ) {
      gameParams.lastRow = 16;
      gameParams.lastCol = 32;
      gameParams.numOfBombs = 99;
      gameParams.width = 646;
      gameParams.height = 324;
      if ( gameParams.sheetType === '/css/webmobile.css' ) {
        // helps support mobile without need for lots of manual pinch-zooming
        gameParams.lastCol = 16;
        gameParams.lastRow = 32;
        gameParams.width = 324;
        gameParams.height = 646;
      }
  } else if ( value === 'Medium' ) {
      gameParams.lastRow = 16;
      gameParams.lastCol = 16;
      gameParams.numOfBombs = 40;
      gameParams.width = 324;
      gameParams.height = 324;
  } else if ( value === 'Small' ) {
      gameParams.lastRow = 10;
      gameParams.lastCol = 10;
      gameParams.numOfBombs = 12;
      gameParams.width = 206;
      gameParams.height = 206;
  }
  gameParams.gameState = 'inplay';
  return gameParams;
}

export { gameParams, submitButton };