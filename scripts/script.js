// JavaScript Document
console.log("hi");

const burgerIcon = document.querySelector("nav div div a:first-child");
const closeIcon = document.querySelector("nav aside ul li:first-child a");
const menu = document.querySelector("nav aside");
let open = true;

function burgerMenu() {
  if (open) {
    menu.classList.remove("menuOpen");
    open = false;
  } else {
    menu.classList.add("menuOpen");
    open = true;
  }
}

burgerIcon.addEventListener("click", burgerMenu);
closeIcon.addEventListener("click", burgerMenu);
