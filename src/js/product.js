"use strict";
import {
  navInit,
  searchInit,
  setCurYear,
  imageInitJs,
  openBag,
  userAccountInit,
} from "./controller.js";
import { products } from "./database.js";

// ------------------------------------------------
// DOM Variables
// ------------------------------------------------

const accordionHeadings = document.querySelectorAll(".accordion-heading");
const accordionContents = document.querySelectorAll(".accordion-content");
const accordionStates = document.querySelectorAll(".accordion-state");
const productContainer = document.querySelector(".product-info-container");
const productSizesOptions = document.querySelectorAll(".product-sizes-option");
const productName = document.querySelector(".product-name");
const productPrice = document.querySelector(".product-price");
const productReviews = document.querySelector(".product-reviews-number");
const addBagButton = document.querySelector(".add-to-bag-button");

// ------------------------------------------------
// Generate Product Info
// ------------------------------------------------

const findDisplayedProduct = function () {
  return products.find((p) => window.location.hash.slice(1) === p.id);
};

const generateProduct = function () {
  const createProductImgHTML = function () {
    return `
    <img
      class="product-img img-blurr"
      src="src/${displayedProduct.productLazyImg}.webp"
      data-src="src/${displayedProduct.productImg}.webp"
      alt="${displayedProduct.name}"
    />
    `;
  };

  const displayedProduct = findDisplayedProduct();
  productName.textContent = displayedProduct.name;
  productPrice.textContent = `$${displayedProduct.price}`;
  productReviews.textContent = `${displayedProduct.reviews} reviews`;
  productContainer.parentElement.insertAdjacentHTML(
    "afterbegin",
    createProductImgHTML()
  );
  const productImg = document.querySelector(".product-img");
  imageInitJs(productImg);
};

const productInit = function () {
  window.addEventListener("load", generateProduct);
  window.addEventListener("hashchange", generateProduct);
};

// ------------------------------------------------
// Product Sizes
// ------------------------------------------------

const clearSizes = function () {
  productSizesOptions.forEach((s) => s.classList.remove("size-chosen"));
};

const selectSize = function (e) {
  if (e.key && e.key !== "Enter") return;
  if (this.classList.contains("size-chosen"))
    this.classList.remove("size-chosen");
  else {
    clearSizes();
    this.classList.add("size-chosen");
  }
};

const sizesInit = function () {
  productSizesOptions.forEach((size) => {
    size.addEventListener("click", selectSize.bind(size));
    size.addEventListener("keydown", selectSize.bind(size));
  });
};

// ------------------------------------------------
// Working Accordion
// ------------------------------------------------

const toggleAccordion = function (e) {
  if (e.key && e.key !== "Enter") return;
  accordionStates[this].textContent = accordionContents[
    this
  ].classList.contains("accordion-active")
    ? "+"
    : "-";
  accordionContents[this].classList.toggle("accordion-active");
};

const accordionInit = function () {
  accordionHeadings.forEach((acc, i) => {
    acc.addEventListener("click", toggleAccordion.bind(i));
    acc.addEventListener("keydown", toggleAccordion.bind(i));
  });
};

// ------------------------------------------------
// Adding to Bag
// ------------------------------------------------

const productExist = function (product, size) {
  return [...Object.keys(localStorage)].find(
    (k) => k === `${product.id}-${size}`
  );
};

const productIncreaseAmount = function (product, size) {
  const updatedProduct = JSON.parse(
    localStorage.getItem(`${product.id}-${size}`)
  );

  updatedProduct["amount"] += 1;

  localStorage.setItem(
    `${updatedProduct.id}-${updatedProduct.size}`,
    JSON.stringify(updatedProduct)
  );
};

const findSizeChosen = function () {
  const sizeChosen = [...productSizesOptions].find((s) =>
    s.classList.contains("size-chosen")
  );
  return sizeChosen ? sizeChosen.dataset.size : false;
};

const saveBoughtProduct = function (product) {
  localStorage.setItem(
    `${product.id}-${product.size}`,
    JSON.stringify(product)
  );
};

const addProductToBag = function () {
  if (!findSizeChosen()) return;

  if (productExist(findDisplayedProduct(), findSizeChosen())) {
    productIncreaseAmount(findDisplayedProduct(), findSizeChosen());
  } else {
    const boughtProduct = JSON.parse(JSON.stringify(findDisplayedProduct()));
    boughtProduct.size = findSizeChosen();
    boughtProduct.amount = 1;

    saveBoughtProduct(boughtProduct);
  }
  clearSizes();
};

const bagInit = function () {
  [addProductToBag, openBag].forEach((f) =>
    addBagButton.addEventListener("click", f)
  );
};

// ------------------------------------------------
// Page Init
// ------------------------------------------------

navInit();
userAccountInit();
searchInit();
productInit();
sizesInit();
bagInit();
accordionInit();
setCurYear();
