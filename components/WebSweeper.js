// "Game": 'WebSweeper',
// "created by": 'benjamin g. west',
// "when": 'June 2018',
// "message": 'project collaboration is invited :)'

// scriptName
var scriptName = 'WebSweeper.js';

// named imports
import { gameParams, submitButton } from './GetGameParameters.js';
import { genGuiBaseBoard } from './MakeBaseBoard.js';
import { genGuiPlaceBombs, genGuiPlaceNumbers, genGuiPlayerHUD, getNumberOfLegalSquares } from './SetBoard.js';
import { playerClick } from './Gameplay.js';

// wait to create game board
document.addEventListener('DOMContentLoaded', function() { 
  waitForGameParams(); 
});
  
function waitForGameParams() {
  submitButton.addEventListener('submit', function() { 
  checkForGameParams(); },
false)};

function checkForGameParams() {
  if ( typeof gameParams.lastCol === 'undefined' ) {
      console.log(`${scriptName} - gameParams.lastCol = ${gameParams.lastCol}`);
      // if not found keep check again in a couple seconds
      setTimeout(checkForGameParams, 2000);
  } else {
      genGuiPlayerHUD(submitButton);
      // store playerName in localStorage
      var playerNameVal = document.getElementById("playerName").value;
      localStorage.setItem("playerName", playerNameVal);
      document.getElementById("playerForm").style.display = 'none';

      // ensure a blank playerName was not used
      // this does not work on mobile very well - room for imporvement in general
      if ( /^\s+$/.test(playerNameVal) || playerNameVal === '' ) {
        localStorage.setItem("playerName", 'DefaultPlayer');
      }

      var makeTime = new Date();
      var timeStarted = `${makeTime.getHours()}:${makeTime.getMinutes()}:${makeTime.getSeconds()}`;
      var datePlayed = `${makeTime.getMonth()}/${makeTime.getDate()}/${makeTime.getFullYear()}`;
      localStorage.setItem('timeFinished', 'TBD');
      localStorage.setItem('datePlayed', datePlayed);
      //hide footer
      document.getElementById("datFooter").style.display = 'none';
      // show legalSquaresRemaining
      document.getElementById("legalSquaresLeft").style.display = 'grid';
      makeGame();
  }
}


function makeGame() {
  // if gameParams have been given let's make the game!
  WebSweeper.MakeBaseBoard(gameParams.lastRow, gameParams.lastCol, gameParams.width, gameParams.height);
  WebSweeper.AddListeners();
  WebSweeper.SetBoard(gameParams.lastRow, gameParams.lastCol, gameParams.numOfBombs);
  // if small board and on mobile, adjust the gameBoard selector
  if ( gameParams.sheetType === '/css/webmobile.css' && gameParams.size === 'Small' ) {
    document.querySelector("#gameBoard").style.marginLeft = "132px";
    console.log(document.querySelector("#gameBoard").style.marginLeft);
  } else if ( gameParams.sheetType === '/css/web.css' && gameParams.size === 'Small' ) {
      document.querySelector("#gameBoard").style.marginLeft = "120px";
      console.log(document.querySelector("#gameBoard").style.marginLeft);
  }
  getNumberOfLegalSquares();
}

// Game Builder and click handler!
class WebSweeper {
  constructor(lastRow, lastCol, numOfBombs) {
      this._lastRow = lastRow;
      this._lastCol = lastCol;
      this._numOfBombs = numOfBombs;
  }
  
  static MakeBaseBoard(x, y, xy, zy) {
    genGuiBaseBoard(x, y, xy, zy);
  }

  static AddListeners() {
    var gameSquares = document.getElementsByClassName("game-squares");
    var textSquares = document.getElementsByClassName("text-squares");
    // event listeners for newly generated board squares
    for ( let i = 0; i < gameSquares.length; i++ ) {
      gameSquares[i].addEventListener("click", function() { 
        WebSweeper.GamePlay(gameSquares[i]) }, false);
      textSquares[i].addEventListener("click", function() { 
        WebSweeper.GamePlay(textSquares[i]) }, false);
    }
  }

  static SetBoard(x, y, z) {
    genGuiPlaceBombs(x, y, z);
    genGuiPlaceNumbers(x, y);
  }

  static GamePlay(e) {
    if (gameParams.gameState === "inplay") {
      gameParams.gameState = playerClick(e, gameParams);
    } else {
        alert('Click reset to play a new game.');
    }
  }

}
