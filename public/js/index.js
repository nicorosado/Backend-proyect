/* eslint-disable no-undef */
const form = document.querySelector('.form')
const titleInput = document.getElementById('title')
const descriptionInput = document.getElementById('description')
const priceInput = document.getElementById('price')
const codeInput = document.getElementById('code')
const stockInput = document.getElementById('stock')

// eslint-disable-next-line no-unused-vars
function deleteProductWithSocket (id) {
  socket.emit('product:delete', id)
}

// eslint-disable-next-line no-unused-vars
async function deleteProduct (id) {
  const response = await fetch(`/api/products/${id}`, {
    method: 'delete'
  })

  if (response.ok) {
    const div = document.getElementById(id)
    div.remove()
  } else {
    alert('cant delete product')
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault()
  const title = titleInput.value
  const description = descriptionInput.value
  const price = parseFloat(priceInput.value)
  const code = codeInput.value
  const stock = parseInt(stockInput.value)

  const product = {
    title,
    description,
    price,
    code,
    stock
  }

  try {
    socket.emit('addProduct', product)
  } catch (error) {
    const res = await fetch('/api/products', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    })
    if (res.ok) {
      const product = (await res.json()).payload
      const container = document.getElementById('product-container')
      const productListElement = document.createElement('div')
      productListElement.innerHTML = `
                <div class="product">
                  <h2>${product.title}</h2>
                  <img src="${product.thumbnails}" alt="">
                  <p><strong>Price:</strong> $${product.price}</p>
                  <p><strong>Stock:</strong> ${product.stock}</p>
                  <button class="delete-btn" onclick="deleteProduct('${product.id}')">Delete</button>
                </div>
        `
      container.appendChild(productListElement)
    }
  }
})

try {
  socket.on('productAdded', async (product) => {
    const container = document.getElementById('product-container')
    const productListElement = document.createElement('div')
    productListElement.innerHTML = `
              <div id="${product.id}" class="product">
                <h2>${product.title}</h2>
                <img src="${product.thumbnails}" alt="">
                <p><strong>Price:</strong> $${product.price}</p>
                <p><strong>Stock:</strong> ${product.stock}</p>
                <button class="delete-btn" onclick="deleteProductWithSocket('${product.id}')">Delete</button>
              </div>`

    container.appendChild(productListElement)
  })
  socket.on('product:deleted', (id) => {
    const div = document.getElementById(id)
    div.remove()
  })
} catch (error) {}
