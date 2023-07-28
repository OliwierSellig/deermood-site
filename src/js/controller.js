"use strict";

// ------------------------------------------------
// DOM Variables
// ------------------------------------------------

const sectionNav = document.querySelector(".section-nav");
const mainSection = document.querySelector("main");
const navLinksContainer = document.querySelector(".nav-links-container");
const mobileMenuOpen = document.querySelector(".mobile-menu-button");
const bagIconNav = document.querySelector(".icon-bag");
const loopIconNav = document.querySelector(".icon-loop");
const bagContainer = document.querySelector(".bag-container");
const bagContainerContent = document.querySelector(".bag-container-content");
const searchContainer = document.querySelector(".search-container");
const bagBlurWindow = document.querySelector(".blur-window-bag");
const userIconNav = document.querySelector(".icon-user");
const userWindowPopup = document.querySelector(".no-account-popup");
const noAccountContainer = document.querySelector(".no-account-container");
const userWindowIconClose = document.querySelector(".no-account-close");
const searchBlurWindow = document.querySelector(".blur-window-search");
const bagHeaderClose = document.querySelector(".bag-header-close");
const searchFormInput = document.querySelector(".search-form-input");
const searchForm = document.querySelector(".search-form");
const bagHeaderNumber = document.querySelector(".bag-header-number");
const bagProductContainer = document.querySelector(".bag-products-container");
const totalPrice = document.querySelector(".checkout-total-price");
const totalItems = document.querySelector(".checkout-total-items");

// ------------------------------------------------
// Sticky Navigation
// ------------------------------------------------

const stickyNav = function (entries) {
  const [entry] = entries;
  const navHeight = sectionNav.getBoundingClientRect().height;

  if (!entry.isIntersecting) {
    document.body.classList.add("sticky");
    mainSection.style.marginTop = `${navHeight}px`;
  } else {
    document.body.classList.remove("sticky");
    mainSection.style = ``;
  }
};

export const navigationObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
});

// ------------------------------------------------
// Helpfull Functions
// ------------------------------------------------

export const emptyInnerHTML = function (object) {
  object.innerHTML = "";
};

// ------------------------------------------------
// Bag & Search Click
// ------------------------------------------------

const toggleBagState = function () {
  bagContainer.classList.toggle("hidden-bag");
  bagBlurWindow.classList.toggle("hidden");
  document.body.classList.toggle("scroll-lock");
  bagContainerContent.classList.toggle("unvisible");
};

const toggleSearchState = function () {
  searchContainer.classList.toggle("hidden");
  searchBlurWindow.classList.toggle("hidden");
  document.body.classList.toggle("scroll-lock");
};

const navLinksOpen = function () {
  navLinksContainer.classList.add("nav-links-active");
  document.body.classList.add("scroll-lock");
};
const navLinksClose = function () {
  navLinksContainer.classList.remove("nav-links-active");
  document.body.classList.remove("scroll-lock");
};

export const openBag = function () {
  const checkForOpenBag = function () {
    return bagIconNav.classList.contains("bag-not-visited");
  };

  const bagFirstOpen = function () {
    if (!checkForOpenBag()) return;
    bagIconNav.classList.remove("bag-not-visited");
  };

  const createBagProduct = function (product, alreadyCreated = true) {
    return `
        <div class="bag-product">
          <img class="bag-product-img ${
            checkForOpenBag() ? "img-blurr-sm" : ""
          }" src="src/${
      checkForOpenBag() ? product.bagLazyImg : product.bagImg
    }.webp" data-src="src/${product.bagImg}.webp" alt="" />
          <div class="bag-product-name-amount">
            <div class="bag-product-name-size">
              <span class="bag-product-name">${product.name}</span>
              <span class="bag-product-size">Size: ${product.size}</span>
            </div>
            <div class="bag-product-amount">
              <button class="bag-product-amount-minus" aria-label="Decrease Product Amount By 1"><img
                class="minus-icon"
                src="src/icons/minus-icon.svg"
                alt=""
              /></button>
              <span class="bag-product-amount-number">${product.amount}</span>
              <button class="bag-product-amount-plus" aria-label="Increase Product Amount By 1"><img
                class="plus-icon"
                src="src/icons/plus-icon.svg"
                alt=""
              /></button>
            </div>
          </div>
          <div class="bag-product-price-trash">
            <span class="bag-product-price">$${(
              product.price * product.amount
            ).toFixed(2)}</span>
            <button class="bag-product-trash-icon" aria-label="Remove Product From Bag"><img
              class="trash-icon"
              src="src/icons/trashcan-icon.svg"
              alt=""
            /></button
          </div>
        </div>
  `;
  };
  const createShoppingList = function (product) {
    product.forEach((p) => {
      bagProductContainer.insertAdjacentHTML("afterbegin", createBagProduct(p));
    });

    const bagProductImgs = document.querySelectorAll(".bag-product-img");
    bagProductImgs.forEach((i) => {
      if (i.src === i.dataset.src) return;
      i.addEventListener("load", function () {
        i.src = i.dataset.src;
        i.addEventListener("load", function () {
          i.classList.remove("img-blurr-sm");
        });
      });
    });
  };

  const calcItemsAmout = function (product) {
    return product
      .map((p) => (p = p.amount))
      .reduce((acc, cur) => {
        return acc + cur;
      });
  };

  const setTotalPrice = function (product) {
    totalPrice.textContent = `$${product
      .map((p) => (p = p.price * p.amount))
      .reduce((acc, cur) => {
        return acc + cur;
      })
      .toFixed(2)}`;
  };

  const setTotalItems = function (amount) {
    totalItems.textContent = `Subtotal ( ${amount} items)`;
    bagHeaderNumber.textContent = amount;
  };

  const findBagProductToDelete = function (product) {
    return [
      product.parentElement.previousElementSibling.firstElementChild.firstElementChild.textContent
        .toLowerCase()
        .replaceAll("-", "")
        .replaceAll(" ", "-")
        .replaceAll("'", ""),
      product.parentElement.previousElementSibling.firstElementChild.lastElementChild.textContent.split(
        " "
      )[1],
    ];
  };

  const findBagProductToAdjust = function (product) {
    const id =
      product.parentElement.parentElement.firstElementChild.firstElementChild.textContent
        .toLowerCase()
        .replaceAll("-", "")
        .replaceAll(" ", "-")
        .replaceAll("'", "");
    const size =
      product.parentElement.parentElement.firstElementChild.lastElementChild.textContent.split(
        " "
      )[1];
    return JSON.parse(localStorage.getItem(`${id}-${size}`));
  };

  const clearClothingData = function () {
    emptyInnerHTML(bagProductContainer);
    setTotalItems(0);
    totalPrice.textContent = `$${0}`;
  };

  const refreshBagInfo = function (fully = false) {
    const bagProducts = Object.values(localStorage).map((p) => JSON.parse(p));
    if (bagProducts.length < 1) {
      clearClothingData();
      return;
    }
    const itemsAmount = calcItemsAmout(bagProducts);
    setTotalPrice(bagProducts);
    setTotalItems(itemsAmount);
    if (fully) {
      emptyInnerHTML(bagProductContainer);
      createShoppingList(bagProducts);
      const productMinus = document.querySelectorAll(
        ".bag-product-amount-minus"
      );
      const productPlus = document.querySelectorAll(".bag-product-amount-plus");
      const productTrash = document.querySelectorAll(".bag-product-trash-icon");
      productMinus.forEach((p) =>
        p.addEventListener("click", adjustAmount.bind(p, "decrease"))
      );
      productPlus.forEach((p) =>
        p.addEventListener("click", adjustAmount.bind(p, "increase"))
      );
      productTrash.forEach((p) =>
        p.addEventListener("click", deleteProduct.bind(p))
      );
    }
  };

  const deleteProduct = function () {
    const [id, size] = findBagProductToDelete(this);
    localStorage.removeItem(`${id}-${size}`);
    refreshBagInfo(true);
  };

  const adjustAmount = function (job) {
    const bagProduct = findBagProductToAdjust(this);
    const bagAmount =
      job === "decrease"
        ? this.nextElementSibling
        : this.previousElementSibling;
    const bagPrice =
      this.parentElement.parentElement.nextElementSibling.firstElementChild;
    if (job === "decrease") {
      bagProduct.amount > 1 ? bagProduct.amount-- : bagProduct.amount;
    } else if (job === "increase") {
      bagProduct.amount++;
    }
    bagAmount.textContent = bagProduct.amount;
    bagPrice.textContent = `$${(
      bagProduct["price"] * bagProduct.amount
    ).toFixed(2)}`;
    localStorage.setItem(
      `${bagProduct.id}-${bagProduct.size}`,
      JSON.stringify(bagProduct)
    );
    refreshBagInfo();
  };

  toggleBagState();
  refreshBagInfo(true);
  bagFirstOpen();
};

export const navInit = function () {
  bagIconNav.addEventListener("click", openBag);
  mobileMenuOpen.addEventListener("click", navLinksOpen);
  navLinksContainer.addEventListener("click", navLinksClose);

  [bagBlurWindow, bagHeaderClose].forEach((trigger) =>
    trigger.addEventListener("click", function () {
      toggleBagState();
    })
  );

  [loopIconNav, searchBlurWindow].forEach((trigger) =>
    trigger.addEventListener("click", function () {
      toggleSearchState();
    })
  );
};

// ------------------------------------------------
// No Account Popup
// ------------------------------------------------

const userWindowAppear = function () {
  userWindowPopup.classList.remove("no-account-hidden");
  noAccountContainer.classList.remove("unvisible");
  const accountDisappearTimeout = setTimeout(() => {
    userWindowPopup.classList.add("no-account-hidden");
  }, 1500);
  userWindowIconClose.addEventListener("click", function () {
    userWindowPopup.classList.add("no-account-hidden");
    clearTimeout(accountDisappearTimeout);
  });
};

const userWindowToggle = function () {
  if (!userWindowPopup.classList.contains("no-account-hidden")) return;
  userWindowAppear();
};

export const userAccountInit = function () {
  userIconNav.parentElement.addEventListener("click", userWindowToggle);
};

// ------------------------------------------------
// Search for Products
// ------------------------------------------------

export const searchInit = function () {
  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    window.location.href = `collections.html#search-${searchFormInput.value.toLowerCase()}`;
    searchFormInput.value = "";
    toggleSearchState();
  });
};

// ------------------------------------------------
// Footer Copyright
// ------------------------------------------------

export const setCurYear = function () {
  const yearElement = document.querySelector(".current-year");
  const currentYear = new Date().getFullYear();
  yearElement.textContent = currentYear;
};

// ------------------------------------------------
// Lazy Loading - CSS
// ------------------------------------------------

export const imagesInit = function () {
  const lazyImgs = document.querySelectorAll("img[data-src]");
  lazyImgs.forEach((img) => {
    img.src = img.dataset.src;
    img.addEventListener("load", function () {
      img.classList.remove("img-blurr");
    });
  });
};

// ------------------------------------------------
// Lazy Loading - JS
// ------------------------------------------------

export const imageInitJs = function (img) {
  img.addEventListener("load", function () {
    img.src = img.dataset.src;
    img.addEventListener("load", function () {
      img.classList.remove("img-blurr");
    });
  });
};
