"use strick";

// ----------- Storing data of the products ---------------------

export const products = [];

class Product {
  id;
  name;
  type;
  sex;
  price;
  size;
  amount;
  collectionsImg;
  collectionsLazyImg;
  productImg;
  productLazyImg;
  bagImg;
  bagLazyImg;
  collectionsView;
  isnew;
  reviews = Math.floor(Math.random() * 100);
  generateCollectionsView(product, alreadyCreated = false) {
    return `
          <a href="product.html#${product.id}" class="clothing-container">
            <div class="clothing-img-container">
              <img
                class="clothing-img ${alreadyCreated ? "" : "img-blurr"}"
                src="src/${
                  alreadyCreated
                    ? product.collectionsImg
                    : product.collectionsLazyImg
                }.webp"
                data-src="src/${product.collectionsImg}.webp"
                loading="lazy"
                alt="${product.name}"
              />
              <span class="take-look"
                ><img
                  class="icon-loop-white"
                  src="src/icons/loop-white-icon.svg"
                  alt="Loop Icon"
                /><span class="take-a-look-text">Take a look!</span></span
              >
            </div>
            <p class="clothing-name">${product.name}</p>
            <span class="clothing-price">$${product.price}</span>
          </a>`;
  }

  constructor(name, type, sex, price, imgId, isNew) {
    this.name = name;
    this.type = type;
    this.sex = sex;
    this.price = price;
    this.collectionsImg = `clothing-img/${imgId}-collections`;
    this.collectionsLazyImg = `clothing-img/${imgId}-lazy`;
    this.productImg = `clothing-img/${imgId}-product`;
    this.productLazyImg = `clothing-img/${imgId}-product-lazy`;
    this.bagImg = `clothing-img/${imgId}-bag`;
    this.bagLazyImg = `clothing-img/${imgId}-bag-lazy`;
    this.isNew = isNew;
    this.id = name
      .toLowerCase()
      .replaceAll("-", "")
      .replaceAll(" ", "-")
      .replaceAll("'", "");
    products.push(this);
    this.collectionsView = this.generateCollectionsView(this);
    this.collectionsViewCreated = this.generateCollectionsView(this, true);
  }
}

const menHoodie1 = new Product(
  "Greentree Organic Hoodie",
  "hoodie",
  "men",
  79.99,
  "men-hoodie-1",
  true
);

const menHoodie2 = new Product(
  "Penzo Cotton Hoodie",
  "hoodie",
  "men",
  74.99,
  "men-hoodie-2",
  false
);

const menHoodie3 = new Product(
  "Sorry I'm different Hoodie",
  "hoodie",
  "men",
  84.99,
  "men-hoodie-3",
  true
);

const menSweater1 = new Product(
  "White Cotton Sweater",
  "sweater",
  "men",
  89.99,
  "men-sweaters-1",
  false
);
const menSweater2 = new Product(
  "Yellow Organic Willow",
  "sweater",
  "men",
  94.99,
  "men-sweaters-2",

  true
);
const menSweater3 = new Product(
  "Hole Packed Sweater",
  "sweater",
  "men",
  92.99,
  "men-sweaters-3",

  false
);

const menTshirt1 = new Product(
  "White Plain T-Shirt",
  "tshirt",
  "men",
  39.99,
  "men-tshirt-1",
  true
);
const menTshirt2 = new Product(
  "Methodical Grey T-shirt",
  "tshirt",
  "men",
  44.99,
  "men-tshirt-2",

  false
);
const menTshirt3 = new Product(
  "T-shirt Cotton Creative",
  "tshirt",
  "men",
  49.99,
  "men-tshirt-3",
  false
);

const menPants1 = new Product(
  "Brown Cotton Jeans",
  "pants",
  "men",
  79.99,
  "men-pants-1",
  true
);
const menPants2 = new Product(
  "Organic Sport Joggers",
  "pants",
  "men",
  89.99,
  "men-pants-2",
  true
);
const menPants3 = new Product(
  "Old-fashioned Cotton Jeans",
  "pants",
  "men",
  69.99,
  "men-pants-3",
  false
);

const menShorts1 = new Product(
  "Organic Men's Shorts",
  "shorts",
  "men",
  59.99,
  "men-shorts-1",
  true
);

const womenHoodie1 = new Product(
  "Cotton Green Hoodie",
  "hoodie",
  "women",
  79.99,
  "women-hoodie-1",
  false
);

const womenHoodie2 = new Product(
  "Sports Grey Hoodie",
  "hoodie",
  "women",
  74.99,
  "women-hoodie-2",
  true
);

const womenPants1 = new Product(
  "Organic Sports Leggings",
  "pants",
  "women",
  64.99,
  "women-pants-1",
  false
);

const womenPants2 = new Product(
  "Women old-fashioned Jeans",
  "pants",
  "women",
  69.99,
  "women-pants-2",
  true
);

const womenPants3 = new Product(
  "Cotton High-pants",
  "pants",
  "women",
  74.99,
  "women-pants-3",
  true
);

const womenShorts1 = new Product(
  "Organic Jeans Shorts",
  "shorts",
  "women",
  59.99,
  "women-shorts-1",
  true
);

const womenShorts2 = new Product(
  "Summer Vibes Shorts",
  "shorts",
  "women",
  54.99,
  "women-shorts-2",
  false
);

const womenShorts3 = new Product(
  "Cotton Sport Shorts",
  "shorts",
  "women",
  54.99,
  "women-shorts-3",
  true
);

const womenSweater1 = new Product(
  "Autumn Cotton Sweater",
  "sweater",
  "women",
  79.99,
  "women-sweaters-1",
  false
);
const womenSweater2 = new Product(
  "Playfull Summer Swaeter",
  "sweater",
  "women",
  74.99,
  "women-sweaters-2",
  true
);
const womenSweater3 = new Product(
  "White Elegant Sweater",
  "sweater",
  "women",
  84.99,
  "women-sweaters-3",
  false
);

const womenTshirt1 = new Product(
  "Plain Cottton T-shirt",
  "tshirt",
  "women",
  44.99,
  "women-tshirt-1",
  true
);
const womenTshirt2 = new Product(
  "Deermood Black T-shirt",
  "tshirt",
  "women",
  39.99,
  "women-tshirt-2",
  false
);
