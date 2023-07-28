"use strict";
import {
  navigationObserver,
  imagesInit,
  navInit,
  searchInit,
  setCurYear,
  emptyInnerHTML,
  imageInitJs,
  userAccountInit,
} from "./controller.js";
import { products } from "./database.js";

// ------------------------------------------------
// DOM Variables
// ------------------------------------------------

const collectionsHeader = document.querySelector(".collections-header");
const collectionsTitle = document.querySelector(".collections-title");
const collectionsContainer = document.querySelector(".collections-container");
const collectionsNavContainer = document.querySelector(".collections-nav");
const collectionsNav = document.querySelector(".collections-options-list");
const priceUpButton = document.querySelector(".price-up-button");
const priceDownButton = document.querySelector(".price-down-button");
const filterIcon = document.querySelector(".collections-filter-button");

// ------------------------------------------------
// Filter Menu (Only below 880px)
// ------------------------------------------------

const filterMenuInit = function () {
  filterIcon.addEventListener("click", function () {
    collectionsNavContainer.classList.toggle("collections-nav-active");
  });

  collectionsNavContainer.addEventListener("click", function () {
    collectionsNavContainer.classList.toggle("collections-nav-active");
  });
};

// ------------------------------------------------
// Manipulate Clothing Info
// ------------------------------------------------

const checkForSearch = function () {
  if (hashSplit()[0] === "search") return true;
  else return false;
};

const hashSplit = function () {
  const [hashSex, type] = window.location.hash.split("-");
  const sex = hashSex.slice(1);
  return [sex, type];
};

const changeCollectionsTitle = function (sex = "", type = "") {
  collectionsTitle.textContent = checkForSearch()
    ? `Search results for: ${hashSplit()[1]}`
    : `${sex[0].toUpperCase() + sex.slice(1)} collection: ${
        type ? type[0].toUpperCase() + type.slice(1) : "All"
      }`;
};

const filterSearchResults = function (product, alreadyCreated = false) {
  const searchProduct = product.filter((p) =>
    p.name.toLowerCase().includes(hashSplit()[1])
  );
  if (searchProduct.length < 1) {
    const nothingFoundMessage = `
          <div class="nothing-found-message">
            <span>Sorry, we couldn't find anything with that keyword...</span>
          </div>
    `;
    collectionsContainer.insertAdjacentHTML("afterbegin", nothingFoundMessage);
  } else {
    searchProduct.forEach((p) => {
      collectionsContainer.insertAdjacentHTML(
        "afterbegin",
        alreadyCreated ? p.collectionsViewCreated : p.collectionsView
      );
    });
  }
};

const filterClothing = function (product, sex, type, alreadyCreated = false) {
  const tempProducts =
    sex === "new"
      ? product.filter((p) => p.isNew)
      : product.filter((p) => p.sex === sex);
  if (!type) {
    tempProducts.forEach((p) => {
      collectionsContainer.insertAdjacentHTML(
        "afterbegin",
        alreadyCreated ? p.collectionsViewCreated : p.collectionsView
      );
    });
  } else {
    tempProducts
      .filter((p) => p.type === type)
      .forEach((p) =>
        collectionsContainer.insertAdjacentHTML(
          "afterbegin",
          alreadyCreated ? p.collectionsViewCreated : p.collectionsView
        )
      );
  }
};

const filterNav = function (sex = "") {
  emptyInnerHTML(collectionsNav);
  if (!checkForSearch()) {
    const navHTML = `
    <li class="collections-option">
      <a href="#${sex}" class="collections-link">All clothing</a>
    </li>
    <li class="collections-option">
      <a href="#${sex}-tshirt" class="collections-link">T-shirts</a>
    </li>
    <li class="collections-option">
      <a href="#${sex}-sweater" class="collections-link">Sweaters</a>
    </li>
    <li class="collections-option">
      <a href="#${sex}-hoodie" class="collections-link">Hoodies</a>
    </li>
    <li class="collections-option">
      <a href="#${sex}-pants" class="collections-link">Pants</a>
    </li>
    <li class="collections-option">
      <a href="#${sex}-shorts" class="collections-link">Shorts</a>
    </li>
`;
    collectionsNav.insertAdjacentHTML("afterbegin", navHTML);
  }
};

const lazyCollectionsImgs = function () {
  const lazyImgs = document.querySelectorAll("img[data-src]");

  lazyImgs.forEach((img) => {
    imageInitJs(img);
  });
};

const loadClothing = function () {
  const [sex, type] = hashSplit();
  if (!sex) return;
  filterNav(sex);
  changeCollectionsTitle(sex, type);
  filterClothing(products, sex, type);
};

const loadSearch = function () {
  filterNav();
  changeCollectionsTitle();
  filterSearchResults(products);
};

const loadCollections = function () {
  emptyInnerHTML(collectionsContainer);
  sortRestart();
  checkForSearch() ? loadSearch() : loadClothing();
  lazyCollectionsImgs();
};

const clothingInit = function () {
  window.addEventListener("load", loadCollections);
  window.addEventListener("hashchange", loadCollections);
};

// ------------------------------------------------
// Price Up/Down Sorting
// ------------------------------------------------

let sortedUp;
let sortedDown;

const sortRestart = function () {
  sortedUp = false;
  sortedDown = false;
};

const sortPrice = function (sortingUp) {
  ///////////////////////////////////
  let sortedProducts = JSON.parse(JSON.stringify(this));
  emptyInnerHTML(collectionsContainer);
  ///////////////////////////////////
  if (sortingUp && !sortedUp) {
    sortedDown = false;
    sortedUp = true;
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (!sortingUp && !sortedDown) {
    sortedUp = false;
    sortedDown = true;
    sortedProducts.sort((a, b) => b.price - a.price);
  } else {
    sortingUp ? (sortedUp = false) : (sortedDown = false);
  }
  ///////////////////////////////////
  if (hashSplit()[0] === "search") {
    filterSearchResults(sortedProducts, true);
  } else {
    const [sex, type] = hashSplit();
    filterClothing(sortedProducts, sex, type, true);
  }
  imagesInit();
};

const priceButtonInit = function () {
  priceUpButton.addEventListener("click", sortPrice.bind(products, true));
  priceDownButton.addEventListener("click", sortPrice.bind(products, false));
};

// ------------------------------------------------
// Page Init
// ------------------------------------------------

navigationObserver.observe(collectionsHeader);
navInit();
userAccountInit();
searchInit();
clothingInit();
priceButtonInit();
filterMenuInit();
setCurYear();
