// JavaScript Document
console.log("hi");

// Sidebar menu

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
  const bounds = board.getBoundingClientRect();
  let lastPosX = 0;
  let lastPosY = 0;
  let ogPosX = 0;
  let ogPosY = 0;
  let currentDroppable = null;
  let elemBelow = null;

  piece.onmousedown = function (event) {
    // moving piece to mouse
    moveAt(event.clientX, event.clientY);
    piece.style.zIndex = 1000;
    ogPosX = ((event.clientX - bounds.left) / ((bounds.right - bounds.left) / 100)) * 8;
    ogPosY = -800 + ((event.clientY - bounds.top) / ((bounds.bottom - bounds.top) / 100)) * 8;
    console.log("Original Position = " + roundDownToNearest1(ogPosX) + "" + roundDownToNearest1(ogPosY));
    selectedPiece.classList.remove("visually-hidden");
    selectedPiece2.classList.add("visually-hidden");

    for (let i = selectedPiece.classList.length - 1; i >= 0; i--) {
      const className = selectedPiece.classList[i];
      if (className.startsWith("square")) {
        selectedPiece.classList.remove(className);
      }
      selectedPiece.classList.add("square-" + roundDownToNearest1(ogPosX) + "" + roundDownToNearest1(ogPosY));
    }
    // moves the piece at (clientX, clientY) coordinates relative to chessboard
    // taking initial shifts into account
    function moveAt(clientX, clientY) {
      const X = ((clientX - bounds.left - piece.offsetWidth / 2) / ((bounds.right - bounds.left) / 100)) * 8;
      const Y = -800 + ((clientY - bounds.top + piece.offsetWidth / 2) / ((bounds.bottom - bounds.top) / 100)) * 8;
      piece.style.transform = "translate(" + X + "%," + Y + "%)";
      lastPosX = ((clientX - bounds.left) / ((bounds.right - bounds.left) / 100)) * 8;
      lastPosY = -800 + ((clientY - bounds.top) / ((bounds.bottom - bounds.top) / 100)) * 8;

      for (let i = hover.classList.length - 1; i >= 0; i--) {
        const className = hover.classList[i];
        if (className.startsWith("square")) {
          hover.classList.remove(className);
        }
        hover.classList.add("square-" + roundDownToNearest1(lastPosX) + "" + roundDownToNearest1(lastPosY));
        hover.classList.remove("visually-hidden");
      }
    }

    function onMouseMove(event) {
      moveAt(event.clientX, event.clientY);
      piece.hidden = true;
      hover.hidden = true;
      selectedPiece.hidden = true;
      elemBelow = document.elementFromPoint(event.clientX, event.clientY);
      // console.log(elemBelow);
      piece.hidden = false;
      hover.hidden = false;
      selectedPiece.hidden = false;

      if (!elemBelow) return;

      let droppableBelow = elemBelow.closest(".piece");
      if (currentDroppable != droppableBelow) {
        if (currentDroppable) {
          // null when we were not over a droppable before this event
          leaveDroppable(currentDroppable);
        }
        currentDroppable = droppableBelow;
        if (currentDroppable) {
          // null if we're not coming over a droppable now
          // (maybe just left the droppable)
          enterDroppable(currentDroppable);
        }
      }
    }

    function enterDroppable(elem) {
      elem.classList.add("targeted");
    }

    function leaveDroppable(elem) {
      elem.classList.remove("targeted");
    }

    // move the piece on mousemove
    board.addEventListener("mousemove", onMouseMove);

    // drop the piece, remove unneeded handlers
    piece.onmouseup = function () {
      board.removeEventListener("mousemove", onMouseMove);
      piece.onmouseup = null;
      // hide the hover
      hover.classList.add("visually-hidden");
      piece.style.zIndex = 0;
      piece.style.transform = null;
      console.log("New Position =  " + roundDownToNearest1(lastPosX) + "" + roundDownToNearest1(lastPosY));

      if (roundDownToNearest1(lastPosX) == roundDownToNearest1(ogPosX) && roundDownToNearest1(lastPosY) == roundDownToNearest1(ogPosY)) {
      } else {
        selectedPiece2.classList.remove("visually-hidden");
        for (let i = selectedPiece2.classList.length - 1; i >= 0; i--) {
          const className = selectedPiece2.classList[i];
          if (className.startsWith("square")) {
            selectedPiece2.classList.remove(className);
          }
        }
        // add new position class
        selectedPiece2.classList.add("square-" + roundDownToNearest1(lastPosX) + "" + roundDownToNearest1(lastPosY));
      }
      if ("enemy") {
        // als onder de muis een enemy square zit en de move legaal is
        // remove current position class
        for (let i = piece.classList.length - 1; i >= 0; i--) {
          const className = piece.classList[i];
          if (className.startsWith("square")) {
            piece.classList.remove(className);
          }
        }
        // add new position class
        piece.classList.add("square-" + roundDownToNearest1(lastPosX) + "" + roundDownToNearest1(lastPosY));
        if (elemBelow == null) {
          return false;
        } else if (elemBelow.classList.contains("piece")) {
          console.log("Removed Piece = ");
          console.log(elemBelow);
          elemBelow.classList.add("visually-hidden");
        }
      } else if ("legal") {
        // als de ruimte open is en er geen enemy square / friendly square in zit,
        // maar de move wel legaal is
      } else if ("illegal") {
        // als de ruimte niet open is en de move niet legaal is
        for (let i = piece.classList.length - 1; i >= 0; i--) {
          const className = piece.classList[i];
          if (className.startsWith("square")) {
            piece.classList.remove(className);
          }
        }
        // add new position class
        piece.classList.add("square-" + roundDownToNearest1(ogPosX) + "" + roundDownToNearest1(ogPosY));
      }
    };
  };

  piece.ondragstart = function () {
    return false;
  };
});
