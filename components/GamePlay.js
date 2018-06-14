// Gameplay.js

// named imports
import { timerOperations,
  genGuiLegalSquaresRemaining, 
  ensureLeaderStatsObjIsAlive } from './SetBoard.js';

function convertEventData(square) {
  // in order for a square to be click in any point, I needed to
  // put the e.listener on both the text and game square
  // the section determines what event listener I am working with
  if (square.startsWith("text")) {
    var textSquareId = document.getElementById(`${square}`);
    var squareRowIndex = textSquareId.getAttribute('data-rowIndex');
    var squareColIndex = textSquareId.getAttribute('data-colIndex');
    var splitTextId = square.split("-", 3);
    splitTextId = splitTextId[2];
    var gameSquareId = document.getElementById(`${splitTextId}`);
  } else if ( square.startsWith("row") ) {
    var gameSquareId = document.getElementById(`${square}`);
    var squareRowIndex = gameSquareId.getAttribute('data-rowIndex');
    var squareColIndex = gameSquareId.getAttribute('data-colIndex');
    var textSquareId = document.getElementById(`text-id-${square}`);
  }
  // convert squareRow/ColIndex from string to int
  squareRowIndex = parseInt(squareRowIndex, 10);
  squareColIndex = parseInt(squareColIndex, 10);
  return { squareRowIndex, squareColIndex, gameSquareId, textSquareId };
}

function checkingBlankNeighbors(gameParams,neighborArr,clearArr) {
  // checkingBlankNeighbors() -- checking surrounding positions while neighborArr has value > 0.

  // 2D array with 8 potential values/positions... aka all the possible positions around a give square.
  var neighborOffsets = [ [-1, -1], [-1, 0], [-1, 1], [0, -1],/*,['0, 0'],*/ [0, 1], [1, -1], [1, 0], [1, 1] ];
  var lengthOfNeighborArr = neighborArr.length;
  // begin checking each position around the clicked square
  while ( lengthOfNeighborArr > 0 ) {
      // get values from neighbor check array
      var squareRowIndex = document.getElementById(neighborArr[0]).getAttribute('data-rowIndex');
      var squareColIndex = document.getElementById(neighborArr[0]).getAttribute('data-colIndex');
      squareRowIndex = parseInt(squareRowIndex, 10);
      squareColIndex = parseInt(squareColIndex, 10);
      
      neighborOffsets.forEach(offset => {  
        var neighborRowIndex = squareRowIndex + offset[0];
        var neighborColIndex = squareColIndex + offset[1];
         // ... if ( the tile is valid aka not null / off the board ) ...
        if (neighborRowIndex >= 0 && neighborRowIndex < gameParams.lastRow && neighborColIndex >= 0 && neighborColIndex < gameParams.lastCol) {
          var neighborSquare = document.getElementById(`text-id-row${neighborRowIndex}col${neighborColIndex}`);
          if ( neighborSquare.innerHTML === '#' ) {
            if ( clearArr.includes(neighborSquare.id) ) {
                // max adding attemps should be: corner square = 3, edge square = 5, 'mid square' = 8;
              } else {
                  neighborArr.push(neighborSquare.id);
                  clearArr.push(neighborSquare.id);
              }

          }
        }
      });
      // remove position 0 and continue to next 0 position if not empty
      neighborArr.splice(0, 1, );
      lengthOfNeighborArr = neighborArr.length;
  }
  return clearArr;
}

function checkingNumberedNeighbors(gameParams,neighborArr,clearArr,cleanBlankSquares) {
  // checkingNumberedNeighbors() -- checking surrounding positions while neighborArr has value > 0.

  // 2D array with 8 potential values/positions... aka all the possible positions around a give square.
  var neighborOffsets = [ [-1, -1], [-1, 0], [-1, 1], [0, -1],/*,['0, 0'],*/ [0, 1], [1, -1], [1, 0], [1, 1] ];
  neighborArr = cleanBlankSquares;
  var lengthOfNeighborArr = neighborArr.length;
  clearArr = [];
  // begin checking each position around the fed blank squares
  while ( lengthOfNeighborArr > 0 ) {
      // get values from neighbor check array
      var squareRowIndex = document.getElementById(neighborArr[0]).getAttribute('data-rowIndex');
      var squareColIndex = document.getElementById(neighborArr[0]).getAttribute('data-colIndex');
      squareRowIndex = parseInt(squareRowIndex, 10);
      squareColIndex = parseInt(squareColIndex, 10);
      
      neighborOffsets.forEach(offset => {  
        var neighborRowIndex = squareRowIndex + offset[0];
        var neighborColIndex = squareColIndex + offset[1];
         // ... if ( the tile is valid aka not null / off the board ) ...
        if (neighborRowIndex >= 0 && neighborRowIndex < gameParams.lastRow && neighborColIndex >= 0 && neighborColIndex < gameParams.lastCol) {
          var neighborSquare = document.getElementById(`text-id-row${neighborRowIndex}col${neighborColIndex}`);

          switch (neighborSquare.innerHTML) {
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
                 if ( clearArr.includes(neighborSquare.id) ) {
                     // max adding attemps should be: corner square = 3, edge square = 5, 'mid square' = 8;
                   } else {
                       clearArr.push(neighborSquare.id);
                   }
            default:
                //console.log(`${neighborSquare.id} is not a numbered square.`);
          }    
        }
      });
      // remove position 0 and continue to next 0 position if not empty
      neighborArr.splice(0, 1, );
      lengthOfNeighborArr = neighborArr.length;
  }
  return clearArr;
}

function findAndClearBlankSquares(textSquareId,squareRowIndex,squareColIndex,gameParams) {
  // findAndClearBlankSquares() - this is only called if clickEvent returns a blank square '#'. 
  //   This function is used to loop and build a 'clearing array' by feeding to checkingBlankNeighbors
  //   until all elements in the array have returned 0
  
  // controls when checkNeighbor loop is finished -- starts by checking the click value
  var neighborArr = [ `${textSquareId}` ];
  // "removal queue"
  var clearArr = [];
  // because a blank square ['#'] was clicked, add it first to be cleared
  clearArr.push(neighborArr[0]);
  var cleanBlankSquares = checkingBlankNeighbors(gameParams,neighborArr,clearArr);
  cleanBlankSquares.forEach(queuedSquare => {
    var textSquare = document.getElementById(queuedSquare);
    textSquare.setAttribute("fill-opacity", "1.0");
    textSquare.innerHTML = '';
    var splitTextId = textSquare.id.split("-", 3);
    splitTextId = splitTextId[2];
    var gameSquare = document.getElementById(`${splitTextId}`);
    gameSquare.setAttribute("fill-opacity", "0.0");
  });

  // now clearArry must be checked for neighboring numbers. 
  var cleanNumberedSquares = checkingNumberedNeighbors(gameParams,neighborArr,clearArr,cleanBlankSquares);
  cleanNumberedSquares.forEach(queuedSquare => {
    var textSquare = document.getElementById(queuedSquare);
    textSquare.setAttribute("fill-opacity", "1.0");
    var splitTextId = textSquare.id.split("-", 3);
    splitTextId = splitTextId[2];
    var gameSquare = document.getElementById(`${splitTextId}`);
    gameSquare.setAttribute("fill-opacity", "0.0");
  });
}

function victoryLap(playerName, datePlayed, timeFinished, boardSize) {
  // records gameplay data and writes to local object to replace current localStorage object
  var leaderStatsObject = ensureLeaderStatsObjIsAlive();
  
  function convertObjectPropertiesToNumbers(leaderStatsArrayObject) {
    // a way to combine values for 1 sort comparison and split later
  
    for ( let i = 0; i < leaderStatsArrayObject.length; i++ ) {
      var grabTimeFinished = leaderStatsArrayObject[i][2];
      var splitValues = grabTimeFinished.split(':', 3);  
      // first convert to numbers
      var hours = parseInt(splitValues[0], 10);
      var minutes = parseInt(splitValues[1], 10);
      var seconds = parseInt(splitValues[2], 10);

      var playerKey = leaderStatsArrayObject[i][0];
      var dateKey = leaderStatsArrayObject[i][1];
      if ( playerKey == 'TBD' || dateKey == 'TBD' ) {
        hours = 0;
        minutes = 1000;
        seconds = 20;
      }
    
      if ( seconds < 10 ) {
          seconds = seconds / 100;
          seconds = seconds.toString();
          seconds = seconds.slice(2,4);
      
          if ( hours === 0 ) {
            // don't do anything, will throw off value
          } else if ( hours > 0 ) {
              // converts hours to minutes and added those minutes to minutse variable
              hours*=60;
              minutes+=hours;
          }
          
          minutes = minutes.toString();
          
          var finalValue = minutes + seconds;
          // converts back to number with correct decimal placing for mins/secs
          finalValue /= Math.pow(10, 2);
  
      } else {
          seconds = parseInt(seconds, 10);
          seconds = seconds.toString();
          seconds = '.' + seconds;
      
          if ( hours === 0 ) {
              // don't do anything, will throw off value
          } else if ( hours > 0 ) {
              // converts hours to minutes and added those minutes to minutse variable
              hours*=60;
              minutes+=hours;
          }
          
          minutes = minutes.toString();
          
          var finalValue = minutes + seconds;
          finalValue = parseFloat(finalValue, 10).toFixed(2);
          finalValue = Number(finalValue);
      }
      // write newly created decimal value for sorting
      leaderStatsArrayObject[i][2] = finalValue;
      }
      return leaderStatsArrayObject;
  }

  function writeBackToLocalStorage(leaderStatsObject) {
    localStorage.setItem('leaderStatsObject', JSON.stringify(leaderStatsObject));
  }
  
  function convertTimeBackToStringsAndExtendPlaceValues(leaderStatsObject) {
    for ( let i = 0; i < leaderStatsObject.length; i++ ) {
      var timeFinishedKey = leaderStatsArrayObject[i][2];
      // extends 10's place to numbers ending 0 and converts back to string
      timeFinishedKey = timeFinishedKey.toFixed(2);
      timeFinishedKey = timeFinishedKey.split('.');
      var finalWrite = `0:${timeFinishedKey[0]}:${timeFinishedKey[1]}`
      leaderStatsArrayObject[i][2] = `${finalWrite}`;
    }
    
    return leaderStatsObject;
    
  }
  
  function rankLeaderBoard(leaderStatsArrayObject) {
    // rank the leaderBoard output so best games go on top
    leaderStatsObject = convertObjectPropertiesToNumbers(leaderStatsArrayObject);
    
    leaderStatsObject = leaderStatsObject.sort(function(a,b) {
      return a[2] - b[2];
    });
    
    // after ranked, if leader board is full, take off last position
    var leaderRowLengthPlusOne = document.getElementsByClassName('leaderRow').length + 1;
    if ( leaderStatsArrayObject.length === leaderRowLengthPlusOne ) {
      leaderStatsArrayObject.pop();
    }

    leaderStatsObject = convertTimeBackToStringsAndExtendPlaceValues(leaderStatsObject);
    writeBackToLocalStorage(leaderStatsObject);

    //console.log(leaderStatsObject);
    console.log('leaderBoard ranked.');
    
  }
  
  var writeToPostion = 0;
  var notBlank = 0;
  // convert to obj array 
  var leaderStatsArrayObject = Object.values(leaderStatsObject);
  // 'game0' gets converted to just '0' -- note for later when converting back
  for ( var i = 0; i < leaderStatsArrayObject.length; i++ ) {
    var playerKey = leaderStatsArrayObject[i][0];
    var dateKey = leaderStatsArrayObject[i][1];
    if ( playerKey == 'TBD' || dateKey == 'TBD' ) {
      // if places on leaderBoard are still blank, save in variable and write
      // to leaderBoard array
      writeToPostion = i;
      break;
    } else if ( playerKey !== 'TBD' || dateKey !== 'TBD' ) {
        // if it's not blank, we don't want to write over without ranking
        notBlank+=1;
    }
  }
  
  if ( notBlank === leaderStatsArrayObject.length ) {
    // if no free spaces: push new value to array, rank, and then pop 
    // last 'extra' position, then rank
    var lastPositionOfArray = leaderStatsArrayObject.length;
    leaderStatsArrayObject[lastPositionOfArray] = [];
    leaderStatsArrayObject[lastPositionOfArray][0] = playerName;
    leaderStatsArrayObject[lastPositionOfArray][1] = datePlayed;
    leaderStatsArrayObject[lastPositionOfArray][2] = timeFinished;
    leaderStatsArrayObject[lastPositionOfArray][3] = boardSize;
    
    rankLeaderBoard(leaderStatsArrayObject);
  } else {
    // else if blank position exists, write first then rank normally
    leaderStatsArrayObject[writeToPostion][0] = playerName;
    leaderStatsArrayObject[writeToPostion][1] = datePlayed;
    leaderStatsArrayObject[writeToPostion][2] = timeFinished;
    leaderStatsArrayObject[writeToPostion][3] = boardSize;

    // then finish by ranking leaderBoard
    rankLeaderBoard(leaderStatsArrayObject);
    // then update localStorage for future retrevial
  }
}

var gameStatus = '';
function endGame(gameStatus, gameParams) {
  // endGame on either Game over or Victory!
  var timeFinished = timerOperations('off');
  var newHeader = document.createElement("h1");
  var endText = '';
  newHeader.setAttribute("class", `${gameStatus}`);
  if ( gameStatus === 'gameover' ) {
    endText = 'GAME OVER' 
  } else if ( gameStatus === 'victory' ) { 
      endText = 'VICTORY!!'
      // update leaderboard
      var playerName = localStorage.getItem('playerName');
      var datePlayed = localStorage.getItem('datePlayed');
      var boardSize = gameParams.size;
      // for consistency, just update single instance of timeFinished in local storage 
      // but object will be updated too next in victoryLap...
      localStorage.setItem('timeFinished', timeFinished);
      timeFinished = localStorage.getItem('timeFinished');
      victoryLap(playerName, datePlayed, timeFinished, boardSize);
    }
  newHeader.innerHTML = `${endText}`;
  document.getElementById("gamestatus").appendChild(newHeader);
  document.querySelector(`.${gameStatus}`).style.position = 'fixed';
  document.getElementById("board").scrollIntoView({behavior: "smooth", block: "start"});
  browsBody.setAttribute("style", "zoom: 110%;");

  var textSquares = document.getElementsByClassName('text-squares');
  for ( let i = 0; i < textSquares.length; i++ ) {
    if ( textSquares[i].innerHTML === '*' ) {
      textSquares[i].setAttribute('fill-opacity', '1.0');
      document.getElementsByClassName('game-squares')[i].setAttribute('fill', 'black');
      document.getElementsByClassName('game-squares')[i].setAttribute('fill-opacity', '1.0');
    }
  }
  return gameParams.gameState = gameStatus;
}

var browsBody = document.getElementById("browserBody");
// named export - Gameplay.js
var playerClick = function (e, gameParams) {
  var square = e.id;
  // take in event, parse, and set variables
  var clickEventData = convertEventData(square);
  var gameSquareId = clickEventData.gameSquareId;
  var textSquareId = clickEventData.textSquareId;
  var squareRowIndex = clickEventData.squareRowIndex;
  var squareColIndex = clickEventData.squareColIndex;
  // Game play conditions & actions
  var textSquareInnerHtml = textSquareId.innerHTML;
  // If a square has already been cleared -- save the CPU and do nothing
  var gameSquareFillOpacity = gameSquareId.getAttribute("fill-opacity");
  if ( gameSquareFillOpacity !== "0.0" ) {
    if ( textSquareInnerHtml === "#" ) {
      // get initial neighbor squares
      findAndClearBlankSquares(textSquareId.id, squareRowIndex,squareColIndex,gameParams);
      var legalSquaresRemaining = genGuiLegalSquaresRemaining();
      document.getElementById("legalSquaresLeft").innerHTML = `${legalSquaresRemaining}`;
      if ( legalSquaresRemaining === 0 ) {
        gameStatus = 'victory';
        endGame(gameStatus, gameParams);
      } else {
        return gameParams.gameState = 'inplay';
        }
    } else if ( textSquareInnerHtml === "*" ) {
        gameSquareId.setAttribute("fill-opacity", "1.0");
        gameSquareId.setAttribute("fill", "black");
        textSquareId.setAttribute("fill-opacity", "1.0");
        gameStatus = 'gameover';
        endGame(gameStatus, gameParams);
      } else {
          // if square is a number just reveal number and no square clearing...
          gameSquareId.setAttribute("fill-opacity", "0.0");
          textSquareId.setAttribute("fill-opacity", "1.0");
          var legalSquaresRemaining = genGuiLegalSquaresRemaining();
          document.getElementById("legalSquaresLeft").innerHTML = `${legalSquaresRemaining}`;
          if ( legalSquaresRemaining === 0 ) {
            gameStatus = 'victory';
            endGame(gameStatus, gameParams);
          } else {
            return gameParams.gameState = 'inplay';
            }
        }
  } else {
      console.log('Square no more.');
      return gameParams.gameState = 'inplay';
  }
}

export { playerClick };