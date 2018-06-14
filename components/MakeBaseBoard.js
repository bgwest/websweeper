// MakeBaseBoard.js

// named export - genGuiBoard
var genGuiBaseBoard = function(lastRow, lastCol, gameBoardWidth, gameBoardHeight) {
  // make base elements and attributes
  var boardTiles = document.getElementById("board");
  var tile = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  var squareElem = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  var textElem = document.createElementNS("http://www.w3.org/2000/svg", "text");
  // define square with and set loop values to 0
  var width = 20;
  var height = width;
  var row = 0;
  var col = 0;
  var xcord = 0;
  var ycord = 0;
  // text element coords
  var textXcord = 6;
  var textYcord = 15;
  // board
  tile.setAttribute("width", `${gameBoardWidth}`);
  tile.setAttribute("height", `${gameBoardHeight}`);
  tile.setAttribute("id", "gameBoard");

  boardTiles.appendChild(tile);
  // row
  for (row = 0; row < lastRow; row++) {
    // col
    for (col = 0; col < lastCol; col++) {
      // rect
      var squareElem = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      squareElem.setAttribute("class", "game-squares");
      squareElem.setAttribute("data-rowIndex", `${row}`)
      squareElem.setAttribute("data-colIndex", `${col}`)
      squareElem.setAttribute("id", `row${row}col${col}`);
      squareElem.setAttribute("width", `${width}px`);
      squareElem.setAttribute("height", `${height}px`);
      squareElem.setAttribute("x", `${xcord}`);
      squareElem.setAttribute("y", `${ycord}`);
      squareElem.setAttribute("stroke", "black");
      squareElem.setAttribute("stroke-width", "1");
      squareElem.setAttribute("stroke-opacity", "0.7");
      squareElem.setAttribute("fill", "#b1bcce");
      squareElem.setAttribute("fill-opacity", "0.5");    
      tile.appendChild(squareElem);
      // generate text elements with base style but wait to add Bombs
      var textElem = document.createElementNS("http://www.w3.org/2000/svg", "text");
      textElem.setAttribute("class", `text-squares`);
      textElem.setAttribute("data-rowIndex", `${row}`)
      textElem.setAttribute("data-colIndex", `${col}`)
      textElem.setAttribute("id", `text-id-row${row}col${col}`);
      textElem.setAttribute("x", `${textXcord}`);
      textElem.setAttribute("y", `${textYcord}`);
      textElem.setAttribute("font-size", "1.0em");
      // text elements are placed invisibily and event handles are laid later
      textElem.setAttribute("fill-opacity", "0.0");
      textElem.innerHTML = `#`;
      tile.appendChild(textElem);
      // looping vars
      xcord+=width;
      textXcord+=width;
    }
    // reset x
    xcord=0;
    textXcord=6;
    // continue y
    ycord+=width;
    textYcord+=width;
  }
}

export { genGuiBaseBoard };