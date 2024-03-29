const PRODUCT_CONFIG = {
  iframe: false,
  contents: {
    img: false,
    quantity: true,
    button: true,
    buttonWithQuantity: false,
    title: false,
    price: false,
  },
  text: {
    button: "Add to cart",
  },
  classes: {
    quantity: "details shopify-buy__quantity-container",
    // quantityInput: "labels-info shopify-buy__quantity",
  },
};

const CART_CONFIG = {
  iframe: false,
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
  iframe: false,
  contents: {
    count: true,
    icon: false,
    title: "in cart",
  },
  text: {
    title: "in cart",
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
const initShopifyProduct = (
  shopifyProductId,
  buyButtonNodeId,
  addToCartText,
  customButtonClasses,
  customButtonWrapperClasses
) => {
  console.log(shopifyProductId);

  initShopifyHelper((ui) => {
    ui.createComponent("product", {
      id: shopifyProductId,
      node: document.getElementById(buyButtonNodeId),
      moneyFormat: "%24%7B%7Bamount%7D%7D",
      options: {
        product: {
          ...PRODUCT_CONFIG,
          text: {
            button: addToCartText,
          },
          classes: {
            quantity: "details shopify-buy__quantity-container",
            button: "shopify-buy__btn " + customButtonClasses,
            buttonWrapper:
              "shopify-buy__btn-wrapper " + customButtonWrapperClasses,
          },
        },
        productSet: {
          styles: {
            products: {
              "@media (min-width: 601px)": {
                "margin-left": "-20px",
              },
            },
          },
        },
        option: {
          classes: {
            option: "details shopify-buy__option-select",
            wrapper: "shopify-buy__option-select-wrapper labels-info",
            label: "shopify-buy__option-select__label labels",
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
              "font-family": "'Hershey', sans-serif",
              "font-size": "16px",
              "padding-top": "16px",
              "padding-bottom": "16px",
              color: "#ffffff",
              ":hover": {
                color: "#ffffff",
                "background-color": "#000000",
              },
              "background-color": "#000000",
              ":focus": {
                "background-color": "#000000",
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
        cart: CART_CONFIG,
        toggle: TOGGLE_CONFIG,
      },
    });
  });
};

/* Initializes _just_ the sliding shopping cart experience without
   any associated product/add-to-cart button. */
const initShopifyCart = (buyButtonNodeId) => {
  initShopifyHelper((ui) => {
    ui.createComponent("cart", {
      options: {
        cart: CART_CONFIG,
        toggle: TOGGLE_CONFIG,
      },
    });
  });
};
