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

function roundDownToNearest1(num) {
  if (num >= 0) {
    return Math.floor(num / 100) + 1;
  } else {
    return Math.ceil(num / 100) / -1 + 1;
  }
}

const chessPieces = document.querySelectorAll(".piece");
const board = document.querySelector("main > section:first-child");

chessPieces.forEach((piece) => {
  const bounds = board.getBoundingClientRect();
  var lastPosX = 0;
  var lastPosY = 0;

  piece.onmousedown = function (event) {
    // moving piece to mouse
    moveAt(event.clientX, event.clientY);
    piece.style.zIndex = 1000;
    // moves the piece at (clientX, clientY) coordinates relative to chessboard
    // taking initial shifts into account
    function moveAt(clientX, clientY) {
      const X = ((clientX - bounds.left - piece.offsetWidth / 2) / 6) * 8;
      const Y = -800 + ((clientY - bounds.top + piece.offsetWidth / 2) / 6) * 8;
      piece.style.transform = "translate(" + X + "%," + Y + "%)";
      lastPosX = ((clientX - bounds.left) / 6) * 8;
      lastPosY = -800 + ((clientY - bounds.top) / 6) * 8;
      console.log(lastPosX);
      console.log(lastPosY);
    }

    function onMouseMove(event) {
      moveAt(event.clientX, event.clientY);
    }

    // move the piece on mousemove
    board.addEventListener("mousemove", onMouseMove);

    // drop the piece, remove unneeded handlers
    piece.onmouseup = function () {
      board.removeEventListener("mousemove", onMouseMove);
      piece.onmouseup = null;
      piece.style.zIndex = 0;
      piece.style.transform = null;
      console.log(roundDownToNearest1(lastPosX));
      console.log(roundDownToNearest1(lastPosY));
      if (1 == 1) {
        // remove current position class
        for (let i = piece.classList.length - 1; i >= 0; i--) {
          const className = piece.classList[i];
          if (className.startsWith("square")) {
            piece.classList.remove(className);
          }
        }
        // add new position class
        piece.classList.add("square-" + roundDownToNearest1(lastPosX) + "" + roundDownToNearest1(lastPosY));
      }
    };
  };

  piece.ondragstart = function () {
    return false;
  };
});
