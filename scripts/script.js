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
      if (pieceType == "rook") {
        let X = roundDownToNearest1(ogPosX);
        let Y = roundDownToNearest1(ogPosY);
        for (let i = 1; i < 9; i++) {
          if (i == Y) {
            for (let j = 1; j < 9; j++) {
              if (j == X) continue;
              const hint = document.createElement("div");
              board.appendChild(hint);
              hint.classList.add("box", "moves", "square-" + j + "" + Y);
            }
          }
          if (i == Y) continue;
          const hint = document.createElement("div");
          board.appendChild(hint);
          hint.classList.add("box", "moves", "square-" + X + "" + i);
        }
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
      } else if (pieceType == "bishop") {
        let X = roundDownToNearest1(ogPosX);
        let Y = roundDownToNearest1(ogPosY);
        for (let i = 1; i < 9; i++) {
          for (let j = 1; j < 9; j++) {
            if (i == X && j == Y) continue;
            if (j - i == Y - X) {
              if (0 < i && i < 9 && 0 < j && j < 9) {
                const hint = document.createElement("div");
                board.appendChild(hint);
                hint.classList.add("box", "moves", "square-" + i + "" + j);
              }
            }
          }
        }
        for (let i = 1; i < 9; i++) {
          for (let j = 1; j < 9; j++) {
            if (i == X && j == Y) continue;
            if (j + i == Y + X) {
              if (0 < i && i < 9 && 0 < j && j < 9) {
                const hint = document.createElement("div");
                board.appendChild(hint);
                hint.classList.add("box", "moves", "square-" + i + "" + j);
              }
            }
          }
        }
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
            }
          }
        }
      } else if (pieceType == "queen") {
        let X = roundDownToNearest1(ogPosX);
        let Y = roundDownToNearest1(ogPosY);
        for (let i = 1; i < 9; i++) {
          for (let j = 1; j < 9; j++) {
            if (i == X && j == Y) continue;
            if (j - i == Y - X) {
              if (0 < i && i < 9 && 0 < j && j < 9) {
                const hint = document.createElement("div");
                board.appendChild(hint);
                hint.classList.add("box", "moves", "square-" + i + "" + j);
              }
            }
          }
        }
        for (let i = 1; i < 9; i++) {
          for (let j = 1; j < 9; j++) {
            if (i == X && j == Y) continue;
            if (j + i == Y + X) {
              if (0 < i && i < 9 && 0 < j && j < 9) {
                const hint = document.createElement("div");
                board.appendChild(hint);
                hint.classList.add("box", "moves", "square-" + i + "" + j);
              }
            }
          }
        }
        for (let i = 1; i < 9; i++) {
          if (i == Y) {
            for (let j = 1; j < 9; j++) {
              if (j == X) continue;
              const hint = document.createElement("div");
              board.appendChild(hint);
              hint.classList.add("box", "moves", "square-" + j + "" + Y);
            }
          }
          if (i == Y) continue;
          const hint = document.createElement("div");
          board.appendChild(hint);
          hint.classList.add("box", "moves", "square-" + X + "" + i);
        }
      } else if (pieceType == "pawn") {
        let X = roundDownToNearest1(ogPosX);
        let Y = roundDownToNearest1(ogPosY);
        for (let i = 1; i < 3; i++) {
          const hint = document.createElement("div");
          board.appendChild(hint);
          if (pieceColor && 0 < Y - i) {
            hint.classList.add("box", "moves", "square-" + X + "" + (Y - i));
          } else if (!pieceColor && Y + i < 9) {
            hint.classList.add("box", "moves", "square-" + X + "" + (Y + i));
          }
        }
      }
    }
    //check for same team
    hints = document.querySelectorAll(".moves");
    hints.forEach((hint) => {
      let belowPieceColor = null;
      const hintBounds = hint.getBoundingClientRect();
      let hintPosX = hintBounds.right - (hintBounds.right - hintBounds.left) / 2;
      let hintPosY = hintBounds.bottom - (hintBounds.bottom - hintBounds.top) / 2;
      hints.forEach((hint) => {
        hint.hidden = true;
      });
      let droppableBelow = document.elementFromPoint(hintPosX, hintPosY);
      hints.forEach((hint) => {
        hint.hidden = false;
      });

      // if (droppableBelow.classList.contains("piece")) {
      //   console.log(droppableBelow);
      // }

      if (droppableBelow != null) {
        if (droppableBelow.classList.contains("piece")) {
          for (let i = droppableBelow.classList.length - 1; i >= 0; i--) {
            const className = droppableBelow.classList[i];
            if (className.startsWith("b")) {
              belowPieceColor = true;
            } else if (className.startsWith("w")) {
              belowPieceColor = false;
            }
          }
        }
        if (belowPieceColor == pieceColor) {
          hint.remove();
        } else if (belowPieceColor == !pieceColor) {
          hint.classList.add("targeted");
        }
      }
    });

    // take current location of piece (ogPos)

    // take the color of the piece (if class starts with "b"= true / "w"= false) and type of piece (if class ends with "r"/"n"/"b"/"k"/"q"/"p")

    // calculate and spit out all possible moves from that pos depending on piece:
    // (using for-loops probably)

    // example: bishop(53) gets +-11 and +-9
    // possible move squares = 31 42 64 75 86 (+-11) and 17 26 35 44 62 71 (+-9)

    // in a for loop draw elements for each number and add the square-"" class
    // relative to the number

    //    if a an enemy piece
    //    (if class starts with "b"= true / "w"= false)
    //    (the inverse of own color) is on the square (either log the positions of all the pieces)
    //    draw a targeted square

    //    if a friendly piece is on the square dont draw

    //    a piece (except for knight) can only move up to the 1st piece in their path
    //    so check if the piece encounters another piece and remove all hints after that point
    //    if its an enemy draw a targeted hint instead

    // show hover square
    hover.classList.remove("visually-hidden");

    for (let i = selectedPiece.classList.length - 1; i >= 0; i--) {
      const className = selectedPiece.classList[i];
      if (className.startsWith("square")) {
        selectedPiece.classList.remove(className);
      }
      selectedPiece.classList.add("square-" + roundDownToNearest1(ogPosX) + "" + roundDownToNearest1(ogPosY));
    }

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
      for (let i = hover.classList.length - 1; i >= 0; i--) {
        const className = hover.classList[i];
        if (className.startsWith("square")) {
          hover.classList.remove(className);
        }
        hover.classList.add("square-" + roundDownToNearest1(lastPosX) + "" + roundDownToNearest1(lastPosY));
      }
    }

    function onMouseMove(event) {
      // sending event data to moveAt function
      moveAt(event.clientX, event.clientY);

      // identifies element under mouse (while avoiding the unnecessary elements)
      piece.hidden = true;
      hover.hidden = true;
      selectedPiece.hidden = true;
      const hints = document.querySelectorAll(".moves");
      hints.forEach((hint) => {
        hint.hidden = true;
      });
      elemBelow = document.elementFromPoint(event.clientX, event.clientY);
      piece.hidden = false;
      hover.hidden = false;
      selectedPiece.hidden = false;
      hints.forEach((hint) => {
        hint.hidden = false;
      });

      // if there is no element below just stop the function here
      if (!elemBelow) return;

      // if the square below is a piece assign this to droppableBelow
      let droppableBelow = elemBelow.closest(".piece");

      // entering and leaving the square
      if (currentDroppable != droppableBelow) {
        if (currentDroppable) {
          // null when we were not over a droppable before this event
        }
        currentDroppable = droppableBelow;
        if (currentDroppable) {
          // null if we're not coming over a droppable now
          // (maybe just left the droppable)
        }
      }
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
        for (let i = selectedPiece2.classList.length - 1; i >= 0; i--) {
          const className = selectedPiece2.classList[i];
          if (className.startsWith("square")) {
            selectedPiece2.classList.remove(className);
          }
        }
        selectedPiece2.classList.add("square-" + roundDownToNearest1(lastPosX) + "" + roundDownToNearest1(lastPosY));
        const hints = document.querySelectorAll(".moves");
        hints.forEach((hint) => {
          hint.remove();
        });
      }

      //remove all hints when finishing turn

      // checks what the targeted square is and what should happen to the pieces involved
      if ("enemy") {
        // check if the targeted square has an enemy (ALWAYS DEFAULTING TO THIS)
        // remove current position class
        for (let i = piece.classList.length - 1; i >= 0; i--) {
          const className = piece.classList[i];
          if (className.startsWith("square")) {
            piece.classList.remove(className);
          }
        }
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
