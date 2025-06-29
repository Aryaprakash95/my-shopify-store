const SHOP = 'z5tazm-dg.myshopify.com'; // replace with your store
const TOKEN = 'ca825f17893a220cf8bbbb16c9c03e72'; // replace with your token

const query = `
{
  products(first: 6) {
    edges {
      node {
        id
        title
        description
        images(first: 1) {
          edges {
            node {
              src
              altText
            }
          }
        }
        variants(first: 1) {
          edges {
            node {
              id
              price {
                amount
              }
            }
          }
        }
      }
    }
  }
}
`;

fetch(`https://z5tazm-dg.myshopify.com/api/2023-01/graphql.json`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': TOKEN,
  },
  body: JSON.stringify({ query }),
})
.then(res => res.json())
.then(data => {
  const products = data.data.products.edges;
  const list = document.getElementById('product-list');
  products.forEach(({ node }) => {
    const img = node.images.edges[0]?.node?.src || '';
    const price = node.variants.edges[0]?.node?.price.amount || '0.00';
    const variantId = node.variants.edges[0]?.node?.id;

    const html = `
      <div class="product">
        <h2>${node.title}</h2>
        <img src="${img}" width="200"/>
        <p>${node.description}</p>
        <p>Price: $${price}</p>
        <button onclick="checkout('${variantId}')">Buy Now</button>
      </div>
    `;
    list.innerHTML += html;
  });
});

function checkout(variantId) {
  const checkoutQuery = `
    mutation {
      checkoutCreate(input: {
        lineItems: [
          {
            variantId: "${variantId}",
            quantity: 1
          }
        ]
      }) {
        checkout {
          webUrl
        }
      }
    }
  `;

  fetch(`https://z5tazm-dg.myshopify.com/api/2023-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN,
    },
    body: JSON.stringify({ query: checkoutQuery }),
  })
  .then(res => res.json())
  .then(data => {
    const url = data.data.checkoutCreate.checkout.webUrl;
    window.location.href = url;
  });
}
