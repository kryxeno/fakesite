// JavaScript Document

// sidebar menu

const burgerIcon = document.querySelector("nav section:first-of-type div button");
const closeIcon = document.querySelector("nav section:last-of-type ul li:first-child button");
const sideMenu = document.querySelector("nav section:last-of-type");
let open = false;

function burgerMenu() {
  if (open) {
    sideMenu.classList.remove("menuOpen");
    document.documentElement.classList.remove("no-scroll");
    open = false;
    burgerIcon.setAttribute("aria-expanded", open);
    closeIcon.setAttribute("aria-expanded", open);
    console.log("Sidebar extended = " + open);
  } else {
    sideMenu.classList.add("menuOpen");
    document.documentElement.classList.add("no-scroll");
    open = true;
    burgerIcon.setAttribute("aria-expanded", open);
    closeIcon.setAttribute("aria-expanded", open);
    console.log("Sidebar extended = " + open);
  }
}

burgerIcon.addEventListener("click", burgerMenu);
closeIcon.addEventListener("click", burgerMenu);

//Ad removal

const adverts = document.querySelectorAll("main > aside");

adverts.forEach((advert) => {
  const button = advert.querySelector("button");
  button.addEventListener("click", () => {
    advert.classList.add("removeAd");
  });
});

// https://www.ditdot.hr/en/dark-mode-website-tutorial
let darkModeState = false;

const darkButton = document.querySelector("header nav section:last-of-type ul:last-of-type button");
const modeTxt = document.querySelector("header nav section:last-of-type ul:last-of-type button span:nth-child(2)");

// MediaQueryList object
const useDark = window.matchMedia("(prefers-color-scheme: dark)");

// Toggles the "dark-mode" class
function toggleDarkMode(state) {
  document.documentElement.classList.toggle("dark-mode", state);
  darkModeState = state;
  if (darkModeState) {
    modeTxt.textContent = "Light UI";
  } else {
    modeTxt.textContent = "Dark UI";
  }
}

// Sets localStorage state
function setDarkModeLocalStorage(state) {
  localStorage.setItem("dark-mode", state);
}

// Initial setting
toggleDarkMode(localStorage.getItem("dark-mode") == "true");

// Listen for changes in the OS settings.
// Note: the arrow function shorthand works only in modern browsers,
// for older browsers define the function using the function keyword.
useDark.addListener((evt) => toggleDarkMode(evt.matches));

// Toggles the "dark-mode" class on click and sets localStorage state
darkButton.addEventListener("click", () => {
  darkModeState = !darkModeState;

  toggleDarkMode(darkModeState);
  setDarkModeLocalStorage(darkModeState);
});

// https://javascript.info/mouse-drag-and-drop

// changes browser coordinates into board coordinates
function roundDownToNearest1(num) {
  if (num >= 0) {
    return Math.floor(num / 100) + 1;
  } else {
    return Math.ceil(num / 100) / -1 + 1;
  }
}

// check what color a piece is
function colorValidation(e) {
  for (let i = e.classList.length - 1; i >= 0; i--) {
    const className = e.classList[i];
    if (className.startsWith("b")) {
      return true;
    } else if (className.startsWith("w")) {
      return false;
    }
  }
}

function hintValidation(e) {
  const hintBounds = e.getBoundingClientRect();
  let hintPosX = hintBounds.right - (hintBounds.right - hintBounds.left) / 2;
  let hintPosY = hintBounds.bottom - (hintBounds.bottom - hintBounds.top) / 2;
  e.hidden = true;
  let droppableBelow = document.elementFromPoint(hintPosX, hintPosY);
  e.hidden = false;

  // different restults depending on color
  if (droppableBelow != null) {
    if (droppableBelow.classList.contains("piece")) {
      return colorValidation(droppableBelow);
    }
  }
}

function squareRemove(e) {
  for (let i = e.classList.length - 1; i >= 0; i--) {
    const className = e.classList[i];
    if (className.startsWith("square")) {
      e.classList.remove(className);
    }
  }
}

const chessPieces = document.querySelectorAll(".piece");
const hover = document.querySelector(".hover");
const selectedPiece = document.querySelector(".active");
const selectedPiece2 = document.querySelector(".active2");
const board = document.querySelector("main > section:first-child");

chessPieces.forEach((piece) => {
  let lastPosX = 0;
  let lastPosY = 0;
  let ogPosX = 0;
  let ogPosY = 0;
  let currentDroppable = null;
  let elemBelow = null;
  let pieceColor = null;
  let pieceType = null;

  piece.onmousedown = function (event) {
    // getting board bounds
    const bounds = board.getBoundingClientRect();

    // moving piece to mouse
    moveAt(event.clientX, event.clientY);
    piece.style.zIndex = 1000;

    // storing original position
    ogPosX = ((event.clientX - bounds.left) / ((bounds.right - bounds.left) / 100)) * 8;
    ogPosY = -800 + ((event.clientY - bounds.top) / ((bounds.bottom - bounds.top) / 100)) * 8;
    console.log("Original Position = " + roundDownToNearest1(ogPosX) + "" + roundDownToNearest1(ogPosY));

    // show orange square under selected piece
    selectedPiece.classList.remove("visually-hidden");
    selectedPiece2.classList.add("visually-hidden");

    // removes any previous hints
    let hints = document.querySelectorAll(".moves");
    hints.forEach((hint) => {
      hint.remove();
    });

    // drawing possible moves
    drawMoves();

    // https://codepen.io/DevilSAM/pen/ZNoByE
    // wont actually be used
    // it is just for visual representation
    const chess = [
      [18, 28, 38, 48, 58, 68, 78, 88],
      //
      [17, 27, 37, 47, 57, 67, 77, 87],
      //
      [16, 26, 36, 46, 56, 66, 76, 86],
      //
      [15, 25, 35, 45, 55, 65, 75, 85],
      //
      [14, 24, 34, 44, 54, 64, 74, 84],
      //
      [13, 23, 33, 43, 53, 63, 73, 83],
      //
      [12, 22, 32, 42, 52, 62, 72, 82],
      //
      [11, 21, 31, 41, 51, 61, 71, 81],
    ];

    function drawMoves() {
      // resets piece details
      pieceColor = null;
      pieceType = null;

      // determines black or white piece (pieceColor)
      for (let i = piece.classList.length - 1; i >= 0; i--) {
        const className = piece.classList[i];
        if (className.startsWith("b")) {
          pieceColor = true;
        } else if (className.startsWith("w")) {
          pieceColor = false;
        }
      }

      // determines black or white piece (pieceColor)
      for (let i = piece.classList.length - 1; i >= 0; i--) {
        const className = piece.classList[i];
        if (className.endsWith("r")) {
          pieceType = "rook";
        } else if (className.endsWith("n")) {
          pieceType = "knight";
        } else if (className.endsWith("b")) {
          pieceType = "bishop";
        } else if (className.endsWith("k")) {
          pieceType = "king";
        } else if (className.endsWith("q")) {
          pieceType = "queen";
        } else if (className.endsWith("p")) {
          pieceType = "pawn";
        }
      }

      // log piece details
      if (pieceColor) {
        console.log("black" + " " + pieceType);
      } else {
        console.log("white" + " " + pieceType);
      }

      // calculates moves
      // ROOK MOVES
      if (pieceType == "rook") {
        let X = roundDownToNearest1(ogPosX);
        let Y = roundDownToNearest1(ogPosY);
        for (let i = 1; i < 9; i++) {
          if (Y + i < 9) {
            const hint = document.createElement("div");
            board.appendChild(hint);
            hint.classList.add("box", "moves", "square-" + X + "" + (Y + i));
            let belowPieceColor = hintValidation(hint);
            if (belowPieceColor == pieceColor) {
              hint.remove();
              break;
            } else if (belowPieceColor == !pieceColor) {
              hint.classList.add("targeted");
              break;
            }
          }
        }
        for (let i = 1; i < 9; i++) {
          if (0 < Y - i) {
            const hint = document.createElement("div");
            board.appendChild(hint);
            hint.classList.add("box", "moves", "square-" + X + "" + (Y - i));
            let belowPieceColor = hintValidation(hint);
            if (belowPieceColor == pieceColor) {
              hint.remove();
              break;
            } else if (belowPieceColor == !pieceColor) {
              hint.classList.add("targeted");
              break;
            }
          }
        }
        for (let j = 1; j < 9; j++) {
          if (X + j < 9) {
            const hint = document.createElement("div");
            board.appendChild(hint);
            hint.classList.add("box", "moves", "square-" + (X + j) + "" + Y);
            let belowPieceColor = hintValidation(hint);
            if (belowPieceColor == pieceColor) {
              hint.remove();
              break;
            } else if (belowPieceColor == !pieceColor) {
              hint.classList.add("targeted");
              break;
            }
          }
        }
        for (let j = 1; j < 9; j++) {
          if (0 < X - j) {
            const hint = document.createElement("div");
            board.appendChild(hint);
            hint.classList.add("box", "moves", "square-" + (X - j) + "" + Y);
            let belowPieceColor = hintValidation(hint);
            if (belowPieceColor == pieceColor) {
              hint.remove();
              break;
            } else if (belowPieceColor == !pieceColor) {
              hint.classList.add("targeted");
              break;
            }
          }
        }
        // KNIGHT MOVES
      } else if (pieceType == "knight") {
        let X = roundDownToNearest1(ogPosX);
        let Y = roundDownToNearest1(ogPosY);
        let j = 2;
        for (let i = 1; i < 3; i++) {
          if (0 < X - i && X - i < 9 && 0 < Y + j && Y + j < 9) {
            const hint = document.createElement("div");
            board.appendChild(hint);
            hint.classList.add("box", "moves", "square-" + (X - i) + "" + (Y + j));
          }
          if (0 < X - i && X - i < 9 && 0 < Y - j && Y - j < 9) {
            const hint = document.createElement("div");
            board.appendChild(hint);
            hint.classList.add("box", "moves", "square-" + (X - i) + "" + (Y - j));
          }
          if (0 < X + i && X + i < 9 && 0 < Y + j && Y + j < 9) {
            const hint = document.createElement("div");
            board.appendChild(hint);
            hint.classList.add("box", "moves", "square-" + (X + i) + "" + (Y + j));
          }
          if (0 < X + i && X + i < 9 && 0 < Y - j && Y - j < 9) {
            const hint = document.createElement("div");
            board.appendChild(hint);
            hint.classList.add("box", "moves", "square-" + (X + i) + "" + (Y - j));
          }
          j--;
        }
        hints = document.querySelectorAll(".moves");
        hints.forEach((hint) => {
          let belowPieceColor = hintValidation(hint);
          if (belowPieceColor == pieceColor) {
            hint.remove();
          } else if (belowPieceColor == !pieceColor) {
            hint.classList.add("targeted");
          }
        });
        // BISHOP MOVES
      } else if (pieceType == "bishop") {
        let X = roundDownToNearest1(ogPosX);
        let Y = roundDownToNearest1(ogPosY);
        for (let i = 1; i < 9; i++) {
          if (0 < X + i && X + i < 9 && 0 < Y + i && Y + i < 9) {
            const hint = document.createElement("div");
            board.appendChild(hint);
            hint.classList.add("box", "moves", "square-" + (X + i) + "" + (Y + i));
            let belowPieceColor = hintValidation(hint);
            if (belowPieceColor == pieceColor) {
              hint.remove();
              break;
            } else if (belowPieceColor == !pieceColor) {
              hint.classList.add("targeted");
              break;
            }
          }
        }
        for (let i = 1; i < 9; i++) {
          if (0 < X - i && X - i < 9 && 0 < Y - i && Y - i < 9) {
            const hint = document.createElement("div");
            board.appendChild(hint);
            hint.classList.add("box", "moves", "square-" + (X - i) + "" + (Y - i));
            let belowPieceColor = hintValidation(hint);
            if (belowPieceColor == pieceColor) {
              hint.remove();
              break;
            } else if (belowPieceColor == !pieceColor) {
              hint.classList.add("targeted");
              break;
            }
          }
        }
        for (let i = 1; i < 9; i++) {
          if (0 < X + i && X + i < 9 && 0 < Y - i && Y - i < 9) {
            const hint = document.createElement("div");
            board.appendChild(hint);
            hint.classList.add("box", "moves", "square-" + (X + i) + "" + (Y - i));
            let belowPieceColor = hintValidation(hint);
            if (belowPieceColor == pieceColor) {
              hint.remove();
              break;
            } else if (belowPieceColor == !pieceColor) {
              hint.classList.add("targeted");
              break;
            }
          }
        }
        for (let i = 1; i < 9; i++) {
          if (0 < X - i && X - i < 9 && 0 < Y + i && Y + i < 9) {
            const hint = document.createElement("div");
            board.appendChild(hint);
            hint.classList.add("box", "moves", "square-" + (X - i) + "" + (Y + i));
            let belowPieceColor = hintValidation(hint);
            if (belowPieceColor == pieceColor) {
              hint.remove();
              break;
            } else if (belowPieceColor == !pieceColor) {
              hint.classList.add("targeted");
              break;
            }
          }
        }
        // KING MOVES
      } else if (pieceType == "king") {
        let X = roundDownToNearest1(ogPosX);
        let Y = roundDownToNearest1(ogPosY);
        for (let i = X - 1; i < X + 2; i++) {
          for (let j = Y - 1; j < Y + 2; j++) {
            if (i == X && j == Y) continue;
            if (0 < i && i < 9 && 0 < j && j < 9) {
              const hint = document.createElement("div");
              board.appendChild(hint);
              hint.classList.add("box", "moves", "square-" + i + "" + j);
              let belowPieceColor = hintValidation(hint);
              if (belowPieceColor == pieceColor) {
                hint.remove();
              } else if (belowPieceColor == !pieceColor) {
                hint.classList.add("targeted");
              }
            }
          }
        }
        // QUEEN MOVES
      } else if (pieceType == "queen") {
        let X = roundDownToNearest1(ogPosX);
        let Y = roundDownToNearest1(ogPosY);
        for (let i = 1; i < 9; i++) {
          if (0 < X + i && X + i < 9 && 0 < Y + i && Y + i < 9) {
            const hint = document.createElement("div");
            board.appendChild(hint);
            hint.classList.add("box", "moves", "square-" + (X + i) + "" + (Y + i));
            let belowPieceColor = hintValidation(hint);
            if (belowPieceColor == pieceColor) {
              hint.remove();
              break;
            } else if (belowPieceColor == !pieceColor) {
              hint.classList.add("targeted");
              break;
            }
          }
        }
        for (let i = 1; i < 9; i++) {
          if (0 < X - i && X - i < 9 && 0 < Y - i && Y - i < 9) {
            const hint = document.createElement("div");
            board.appendChild(hint);
            hint.classList.add("box", "moves", "square-" + (X - i) + "" + (Y - i));
            let belowPieceColor = hintValidation(hint);
            if (belowPieceColor == pieceColor) {
              hint.remove();
              break;
            } else if (belowPieceColor == !pieceColor) {
              hint.classList.add("targeted");
              break;
            }
          }
        }
        for (let i = 1; i < 9; i++) {
          if (0 < X + i && X + i < 9 && 0 < Y - i && Y - i < 9) {
            const hint = document.createElement("div");
            board.appendChild(hint);
            hint.classList.add("box", "moves", "square-" + (X + i) + "" + (Y - i));
            let belowPieceColor = hintValidation(hint);
            if (belowPieceColor == pieceColor) {
              hint.remove();
              break;
            } else if (belowPieceColor == !pieceColor) {
              hint.classList.add("targeted");
              break;
            }
          }
        }
        for (let i = 1; i < 9; i++) {
          if (0 < X - i && X - i < 9 && 0 < Y + i && Y + i < 9) {
            const hint = document.createElement("div");
            board.appendChild(hint);
            hint.classList.add("box", "moves", "square-" + (X - i) + "" + (Y + i));
            let belowPieceColor = hintValidation(hint);
            if (belowPieceColor == pieceColor) {
              hint.remove();
              break;
            } else if (belowPieceColor == !pieceColor) {
              hint.classList.add("targeted");
              break;
            }
          }
        }
        for (let i = 1; i < 9; i++) {
          if (Y + i < 9) {
            const hint = document.createElement("div");
            board.appendChild(hint);
            hint.classList.add("box", "moves", "square-" + X + "" + (Y + i));
            let belowPieceColor = hintValidation(hint);
            if (belowPieceColor == pieceColor) {
              hint.remove();
              break;
            } else if (belowPieceColor == !pieceColor) {
              hint.classList.add("targeted");
              break;
            }
          }
        }
        for (let i = 1; i < 9; i++) {
          if (0 < Y - i) {
            const hint = document.createElement("div");
            board.appendChild(hint);
            hint.classList.add("box", "moves", "square-" + X + "" + (Y - i));
            let belowPieceColor = hintValidation(hint);
            if (belowPieceColor == pieceColor) {
              hint.remove();
              break;
            } else if (belowPieceColor == !pieceColor) {
              hint.classList.add("targeted");
              break;
            }
          }
        }
        for (let j = 1; j < 9; j++) {
          if (X + j < 9) {
            const hint = document.createElement("div");
            board.appendChild(hint);
            hint.classList.add("box", "moves", "square-" + (X + j) + "" + Y);
            let belowPieceColor = hintValidation(hint);
            if (belowPieceColor == pieceColor) {
              hint.remove();
              break;
            } else if (belowPieceColor == !pieceColor) {
              hint.classList.add("targeted");
              break;
            }
          }
        }
        for (let j = 1; j < 9; j++) {
          if (0 < X - j) {
            const hint = document.createElement("div");
            board.appendChild(hint);
            hint.classList.add("box", "moves", "square-" + (X - j) + "" + Y);
            let belowPieceColor = hintValidation(hint);
            if (belowPieceColor == pieceColor) {
              hint.remove();
              break;
            } else if (belowPieceColor == !pieceColor) {
              hint.classList.add("targeted");
              break;
            }
          }
        }
        // PAWN MOVES
      } else if (pieceType == "pawn") {
        let X = roundDownToNearest1(ogPosX);
        let Y = roundDownToNearest1(ogPosY);
        for (let i = 1; i < 3; i++) {
          if (pieceColor && 0 < Y - i) {
            if (i == 1) {
              for (let j = 1; j > -2; j--) {
                if (j == 0) continue;
                if (0 < X + j && X + j < 9) {
                  const hint = document.createElement("div");
                  board.appendChild(hint);
                  hint.classList.add("box", "targeted", "moves", "square-" + (X + j) + "" + (Y - i));
                  let belowPieceColor = hintValidation(hint);
                  if (belowPieceColor != !pieceColor) {
                    hint.remove();
                  }
                }
              }
            }
            const hint = document.createElement("div");
            board.appendChild(hint);
            hint.classList.add("box", "moves", "square-" + X + "" + (Y - i));
            let belowPieceColor = hintValidation(hint);
            if (belowPieceColor == pieceColor || belowPieceColor == !pieceColor) {
              hint.remove();
              break;
            }
          } else if (!pieceColor && Y + i < 9) {
            if (i == 1) {
              for (let j = 1; j > -2; j--) {
                if (j == 0) continue;
                if (0 < X + j && X + j < 9) {
                  const hint = document.createElement("div");
                  board.appendChild(hint);
                  hint.classList.add("box", "targeted", "moves", "square-" + (X + j) + "" + (Y + i));
                  let belowPieceColor = hintValidation(hint);
                  if (belowPieceColor != !pieceColor) {
                    hint.remove();
                  }
                }
              }
            }
            const hint = document.createElement("div");
            board.appendChild(hint);
            hint.classList.add("box", "moves", "square-" + X + "" + (Y + i));
            let belowPieceColor = hintValidation(hint);
            if (belowPieceColor == pieceColor || belowPieceColor == !pieceColor) {
              hint.remove();
              break;
            }
          }
        }
      }
    }

    // show hover square
    hover.classList.remove("visually-hidden");

    squareRemove(selectedPiece);
    selectedPiece.classList.add("square-" + roundDownToNearest1(ogPosX) + "" + roundDownToNearest1(ogPosY));

    // moves the piece at (clientX, clientY) coordinates relative to chessboard
    function moveAt(clientX, clientY) {
      // mouse position relative to board
      const X = ((clientX - bounds.left - piece.offsetWidth / 2) / ((bounds.right - bounds.left) / 100)) * 8;
      const Y = -800 + ((clientY - bounds.top + piece.offsetWidth / 2) / ((bounds.bottom - bounds.top) / 100)) * 8;

      // moving piece
      piece.style.transform = "translate(" + X + "%," + Y + "%)";

      // storing last position
      lastPosX = ((clientX - bounds.left) / ((bounds.right - bounds.left) / 100)) * 8;
      lastPosY = -800 + ((clientY - bounds.top) / ((bounds.bottom - bounds.top) / 100)) * 8;

      // updates position class of hover square
      squareRemove(hover);
      hover.classList.add("square-" + roundDownToNearest1(lastPosX) + "" + roundDownToNearest1(lastPosY));
    }

    function onMouseMove(event) {
      // sending event data to moveAt function
      moveAt(event.clientX, event.clientY);

      // identifies element under mouse (while avoiding the unnecessary elements)
      piece.hidden = true;
      hover.hidden = true;
      selectedPiece.hidden = true;
      elemBelow = document.elementFromPoint(event.clientX, event.clientY);
      piece.hidden = false;
      hover.hidden = false;
      selectedPiece.hidden = false;
    }

    // move the piece on mousemove
    board.addEventListener("mousemove", onMouseMove);

    // drop the piece, remove unneeded handlers
    piece.onmouseup = function () {
      // stop executing the onMouseMove function
      board.removeEventListener("mousemove", onMouseMove);

      // ready the function for the next piece move
      piece.onmouseup = null;

      // hide the hover square
      hover.classList.add("visually-hidden");

      // return piece to standard zIndex and remove transform
      piece.style.zIndex = null;
      piece.style.transform = null;
      console.log("New Position = " + roundDownToNearest1(lastPosX) + "" + roundDownToNearest1(lastPosY));

      // check if the piece has moved to a different square
      if (roundDownToNearest1(lastPosX) == roundDownToNearest1(ogPosX) && roundDownToNearest1(lastPosY) == roundDownToNearest1(ogPosY)) {
        // do nothing
      } else {
        // adds a second orange square at the new position
        selectedPiece2.classList.remove("visually-hidden");
        squareRemove(selectedPiece2);
        selectedPiece2.classList.add("square-" + roundDownToNearest1(lastPosX) + "" + roundDownToNearest1(lastPosY));
        //remove all hints when finishing turn
        const hints = document.querySelectorAll(".moves");
        hints.forEach((hint) => {
          hint.remove();
        });
      }

      console.log(elemBelow);

      // checks what the targeted square is and what should happen to the pieces involved
      if ("enemy") {
        // check if the targeted square has an enemy
        // remove current position class
        squareRemove(piece);
        piece.classList.add("square-" + roundDownToNearest1(lastPosX) + "" + roundDownToNearest1(lastPosY));

        // check if there is an element below the mouse
        if (elemBelow == null) {
          return false;
        } else if (elemBelow.classList.contains("piece")) {
          // removes and logs the piece below the mouse
          console.log("Removed Piece = ");
          console.log(elemBelow);
          elemBelow.classList.add("visually-hidden");
        }
      } else if ("legal") {
        // checks if the move is possible according to the piece that is being moved and if it is legal
      } else if ("illegal") {
        // checks if the move is invalid (will probably be just "else")
        // friendly/illegal square/checks
        // the piece will just return to the original position and the turn will keep going
      }
    };
  };

  // cancelling the vanilla drag functionality
  piece.ondragstart = function () {
    return false;
  };
});
