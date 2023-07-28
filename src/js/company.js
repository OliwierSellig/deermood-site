"use-strict";
import {
  navigationObserver,
  imagesInit,
  navInit,
  searchInit,
  setCurYear,
  userAccountInit,
} from "./controller.js";

// ------------------------------------------------
// DOM Variables
// ------------------------------------------------

const sectionEssentials = document.querySelector(".section-essentials");
const essentialsButtons = document.querySelectorAll(".essentials-button");
const essetialsContent = document.querySelectorAll(".essentials-content");

// ------------------------------------------------
// Essentials Changing
// ------------------------------------------------

const essentialsInit = function () {
  essentialsButtons.forEach((Button, i) => {
    Button.addEventListener("click", function () {
      essetialsContent.forEach((content) => {
        content.classList.remove("essentials-content--active");
      });
      essetialsContent[i].classList.add("essentials-content--active");
      essentialsButtons.forEach((Button) => {
        Button.classList.remove("essentials-button--active");
      });
      Button.classList.add("essentials-button--active");
    });
  });
};

// ------------------------------------------------
// Page Init
// ------------------------------------------------

navigationObserver.observe(sectionEssentials);
imagesInit();
navInit();
userAccountInit();
searchInit();
essentialsInit();
setCurYear();
