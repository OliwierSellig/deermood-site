"use-strict";
import {
  navigationObserver,
  imagesInit,
  navInit,
  searchInit,
  setCurYear,
  emptyInnerHTML,
  userAccountInit,
} from "./controller.js";

// ------------------------------------------------
// DOM Variables
// ------------------------------------------------

const sectionHero = document.querySelector(".section-hero");
const emailPopupWindow = document.querySelector(".email-popup");
const emailPopupContainer = document.querySelector(".email-popup-container");
const emailPopupCloseIcon = document.querySelector(".email-popup-close");
const emailPopupContent = document.querySelector(".email-popup-content");
const emailPopupForm = document.querySelector(".email-popup-form");
const gallerySlider = document.querySelector(".gallery-slider");
const testimonialsButtonLeft = document.querySelector(
  ".testimonials--button-left"
);
const testimonialsButtonRight = document.querySelector(
  ".testimonials--button-right"
);
const testimonialsSlides = document.querySelectorAll(".testimonials-slide");
const testimonialsDots = document.querySelectorAll(".testimonials-dot");
const sectionImpact = document.querySelector(".section-impact");
const achievementsValues = document.querySelectorAll(".achievements-number");

// ------------------------------------------------
// Gallery Scroller
// ------------------------------------------------

const scrollerInit = function () {
  let isDragging = false;
  let startX;
  let startScrollLeft;

  const dragStart = function (e) {
    isDragging = true;
    gallerySlider.classList.add("dragging");
    startX = e.pageX;
    startScrollLeft = gallerySlider.scrollLeft;
  };

  const dragging = function (e) {
    if (!isDragging) return;
    gallerySlider.scrollLeft = startScrollLeft - (e.pageX - startX);
  };

  const dragStop = function () {
    isDragging = false;
    gallerySlider.classList.remove("dragging");
  };

  gallerySlider.addEventListener("mousedown", dragStart);
  gallerySlider.addEventListener("mousemove", dragging);
  document.addEventListener("mouseup", dragStop);
};

// ------------------------------------------------
// Testimonials Slider
// ------------------------------------------------

const testSliderInit = function () {
  let curSlide = 0;
  const maxSlide = testimonialsSlides.length - 1;

  const goToSlide = function (slide) {
    testimonialsSlides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  };

  const refreshDots = function (dotActive) {
    testimonialsDots.forEach((dot) =>
      dot.classList.remove("testimonials-dot-active")
    );
    testimonialsDots[dotActive].classList.add("testimonials-dot-active");
  };

  const nextSlide = function () {
    if (curSlide === maxSlide) curSlide = 0;
    else curSlide++;
    goToSlide(curSlide);
    refreshDots(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) curSlide = maxSlide;
    else curSlide--;
    goToSlide(curSlide);
    refreshDots(curSlide);
  };

  const arrowMovement = function (e) {
    if (e.key === "ArrowLeft") prevSlide();
    if (e.key === "ArrowRight") nextSlide();
  };

  goToSlide(curSlide);
  refreshDots(curSlide);
  testimonialsButtonLeft.addEventListener("click", prevSlide);
  testimonialsButtonRight.addEventListener("click", nextSlide);
  document.addEventListener("keydown", arrowMovement);
  testimonialsDots.forEach((dot, i) =>
    dot.addEventListener("click", function () {
      curSlide = i;
      goToSlide(curSlide);
      refreshDots(curSlide);
    })
  );
};

// ------------------------------------------------
// Number Counting Animation
// ------------------------------------------------

const countNumber = function (entries, observer) {
  const [entry] = entries;
  const interval = 5000;
  if (!entry.isIntersecting) return;
  achievementsValues.forEach((value) => {
    let startValue = 0;
    const endValue = parseInt(value.getAttribute("data-val"));
    const duration = Math.floor(interval / endValue);
    const counter = setInterval(function () {
      startValue += Math.floor(Math.random() * 1000);
      value.textContent = startValue;
      if (startValue >= endValue) {
        value.textContent = endValue;
        clearInterval(counter);
        observer.unobserve(sectionImpact);
      }
    }, duration);
  });
};

const numberMainObserver = new IntersectionObserver(countNumber, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

// ------------------------------------------------
// Email Popup
// ------------------------------------------------

const emailInit = function () {
  const generateThanksMessage = function () {
    return `<p class="email-popup-thanks-message">Thanks for submiting. You'll love it.. we promise :)</p>`;
  };

  const toggleEmail = function () {
    emailPopupWindow.classList.toggle("email-popup-hidden");
    emailPopupContainer.classList.remove("unvisible");
  };

  const emailButonInit = function () {
    emailPopupCloseIcon.addEventListener("click", toggleEmail);
  };

  const emailClose = function () {
    emptyInnerHTML(emailPopupContent);
    emailPopupContent.insertAdjacentHTML("afterbegin", generateThanksMessage());
    setTimeout(toggleEmail, 1000);
  };

  const emailAppear = function () {
    toggleEmail();
    emailButonInit();
    emailPopupForm.addEventListener("submit", emailClose);
  };

  window.addEventListener("load", function () {
    this.setTimeout(emailAppear, 2000);
  });
};

// ------------------------------------------------
// Page Init
// ------------------------------------------------

navigationObserver.observe(sectionHero);
numberMainObserver.observe(sectionImpact);
imagesInit();
navInit();
userAccountInit();
searchInit();
testSliderInit();
scrollerInit();
emailInit();
setCurYear();
