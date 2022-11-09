// The config styles below are required for styling the HTML elements within Shopify iframes.
// They do not inherit the CSS styles and variables from the main website so we need to manually
// reconfigure them here.
//
// Some of this is copied from the Shopify code and some of it is edited to match our styling.
//
const PRODUCT_CONFIG = {
  iframe: false,
  contents: {
    img: false,
    button: false,
    buttonWithQuantity: true,
    title: false,
    price: false,
  },
  text: {
    button: "Add to cart",
  },
};

const CART_CONFIG = {
  styles: {
    button: {
      "font-family": "Gill Sans, sans-serif",
      "font-size": "16px",
      "padding-top": "16px",
      "padding-bottom": "16px",
      color: "#000000",
      ":hover": {
        color: "#000000",
        "background-color": "#e6e6e6",
      },
      "background-color": "#ffffff",
      ":focus": {
        "background-color": "#e6e6e6",
      },
    },
  },
  text: {
    total: "Subtotal",
    button: "Checkout",
  },
  popup: true,
};

const TOGGLE_CONFIG = {
  styles: {
    toggle: {
      "font-family": "Gill Sans, sans-serif",
      "background-color": "#ffffff",
      ":hover": {
        "background-color": "#e6e6e6",
      },
      ":focus": {
        "background-color": "#e6e6e6",
      },
    },
    count: {
      "font-size": "16px",
      color: "#000000",
      ":hover": {
        color: "#000000",
      },
    },
    iconPath: {
      fill: "#000000",
    },
  },
};

/* Loads the shopify SDK and runs the provided onLoad function afterwards. */
const initShopifyHelper = (setupShopifyFn) => {
  const onLoad = () => {
    // Initialize the Shopify JS client. Note that the storefront access token
    // provides scoped, unauthenticated access to the Shopify API from the visitor's
    // browser and does not have any sensitive permissions.
    var client = ShopifyBuy.buildClient({
      domain: "sfpc-nyc.myshopify.com",
      storefrontAccessToken: "560b7d9768c854569b3175f1a0ad02db",
    });
    ShopifyBuy.UI.onReady(client).then(setupShopifyFn);
  };

  var scriptURL =
    "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";
  if (window.ShopifyBuy) {
    if (window.ShopifyBuy.UI) {
      onLoad();
    } else {
      loadScript();
    }
  } else {
    loadScript();
  }

  function loadScript() {
    var script = document.createElement("script");
    script.async = true;
    script.src = scriptURL;
    (
      document.getElementsByTagName("head")[0] ||
      document.getElementsByTagName("body")[0]
    ).appendChild(script);
    script.onload = onLoad;
  }
};

/* Initializes the Add to cart / Buy button for a given product, as well as the
   shopping cart sliding window. */
const initShopifyProduct = (shopifyProductId, buyButtonNodeId) => {
  console.log(shopifyProductId);
  initShopifyHelper((ui) => {
    const test = ui.createComponent("product", {
      id: shopifyProductId,
      node: document.getElementById(buyButtonNodeId),
      moneyFormat: "%24%7B%7Bamount%7D%7D",
      options: {
        product: PRODUCT_CONFIG,
        productSet: {
          styles: {
            products: {
              "@media (min-width: 601px)": {
                "margin-left": "-20px",
              },
            },
          },
        },
        modalProduct: {
          contents: {
            img: false,
            imgWithCarousel: true,
            button: false,
            buttonWithQuantity: true,
          },
          styles: {
            product: {
              "@media (min-width: 601px)": {
                "max-width": "100%",
                "margin-left": "0px",
                "margin-bottom": "0px",
              },
            },
            button: {
              "font-family": "Gill Sans, sans-serif",
              "font-size": "16px",
              "padding-top": "16px",
              "padding-bottom": "16px",
              color: "#000000",
              ":hover": {
                color: "#000000",
                "background-color": "#e6e6e6",
              },
              "background-color": "#ffffff",
              ":focus": {
                "background-color": "#e6e6e6",
              },
            },
            quantityInput: {
              "font-size": "16px",
              "padding-top": "16px",
              "padding-bottom": "16px",
            },
          },
          text: {
            button: "Add to cart",
          },
        },
        option: {},
        cart: CART_CONFIG,
        toggle: TOGGLE_CONFIG,
      },
    });

    const frameHead = document.querySelector(`${buyButtonNodeId} iframe head`);
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
    @font-face {
      font-family: 'Hershey';
      src: url('fonts/Hershey-Noailles-Futura-Duplex-Bold.woff2') format('woff2'),
          url('fonts/Hershey-Noailles-Futura-Duplex-Bold.woff') format('woff');
      font-weight: bold;
      font-style: normal;
      font-display: block;
  }
  
  @font-face {
      font-family: 'Hershey';
      src: url('fonts/Hershey-Noailles-Futura-Duplex-Regular.woff2') format('woff2'),
          url('fonts/Hershey-Noailles-Futura-Duplex-Regular.woff') format('woff');
      font-weight: normal;
      font-style: normal;
      font-display: block;
  }
    `;

    frameHead.appendChild(styleSheet);
  });
};

/* Initializes _just_ the sliding shopping cart experience without 
   any associated product/add-to-cart button. */
const initShopifyCart = (buyButtonNodeId) => {
  initShopifyHelper((ui) => {
    ui.createComponent("cart", {
      // id: shopifyProductId,
      // node: document.getElementById(buyButtonNodeId),
      // moneyFormat: "%24%7B%7Bamount%7D%7D",
      options: {
        cart: CART_CONFIG,
        toggle: TOGGLE_CONFIG,
      },
    });
  });
};
