const { Shopify } = require("@shopify/shopify-api");

// This token is not actually sensitive, and allows
// unauthenticated read-only access to product listings and quantities
const SHOPIFY_STOREFRONT_TOKEN = "c0b6acf5755d397d7c34d410b115dfbe";

const shopifyStorefrontClient = new Shopify.Clients.Storefront(
  "sfpc-nyc.myshopify.com",
  SHOPIFY_STOREFRONT_TOKEN
);

exports.getShopifyProducts = async () => {
  const shopifyData = await shopifyStorefrontClient.query({
    data: `{
          products (first: 250) {
            edges {
              node {
                id
                title
                totalInventory
                availableForSale
                variants (first: 250) {
                  edges {
                    node {
                      quantityAvailable
                    }
                  }
                }
              }
            }
          }
        }`,
  });

  return Object.fromEntries(
    shopifyData.body.data.products.edges.map((edge) => {
      return [edge.node.id, edge.node];
    })
  );
};

exports.getShopifyProduct = async (shopifyId) => {
  const shopifyData = await shopifyStorefrontClient.query({
    data: `{
        product(id: "gid:\/\/shopify\/Product\/${shopifyId}") {
            id
            title
            totalInventory
            availableForSale
            variants (first: 250) {
              edges {
                node {
                  quantityAvailable
                }
              }
            }
          }
        }`,
  });

  return shopifyData.body.data.product;
};
