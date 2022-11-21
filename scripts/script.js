// JavaScript Document
console.log("hi");

const burgerIcon = document.querySelector("nav section:first-of-type div button");
const closeIcon = document.querySelector("nav section:last-of-type ul li:first-child button");
const menu = document.querySelector("nav section:last-of-type");
let open = true;

function burgerMenu() {
  if (open) {
    menu.classList.remove("menuOpen");
    open = false;
    burgerIcon.setAttribute("aria-expanded", open);
    closeIcon.setAttribute("aria-expanded", open);
    console.log("Sidebar extended = " + open);
  } else {
    menu.classList.add("menuOpen");
    open = true;
    burgerIcon.setAttribute("aria-expanded", open);
    closeIcon.setAttribute("aria-expanded", open);
    console.log("Sidebar extended = " + open);
  }
}

burgerIcon.addEventListener("click", burgerMenu);
closeIcon.addEventListener("click", burgerMenu);
