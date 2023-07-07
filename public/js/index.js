/* eslint-disable space-before-function-paren */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import fetch from 'node-fetch'
const form = document.querySelector('.form')
const titleInput = document.getElementById('title')
const descriptionInput = document.getElementById('description')
const priceInput = document.getElementById('price')
const codeInput = document.getElementById('code')
const stockInput = document.getElementById('stock')

// eslint-disable-next-line no-unused-vars, space-before-function-paren
async function deleteProductWithSocket(id) {
  socket.emit('product:delete', id)
}

// eslint-disable-next-line no-unused-vars, space-before-function-paren
async function deleteProduct(id) {
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

try {
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
        const product = (await res.json()).data
        const container = document.getElementById('product-container')
        const productListElement = document.createElement('div')
        productListElement.innerHTML = `
                <div class="product">
                  <h2>${product.title}</h2>
                  <img src="${product.thumbnails}" alt="">
                  <p><strong>Price:</strong> $${product.price}</p>
                  <p><strong>Stock:</strong> ${product.stock}</p>
                  <button class="delete-btn" onclick="deleteProduct('${product._id}')">Delete</button>
                </div>
        `
        container.appendChild(productListElement)
      }
    }
  })
} catch (e) { }

async function addToCart(productId) {
  try {
    let cartId = localStorage.getItem('cartId')
    if (!cartId) {
      const response = await fetch('http://localhost:8080/api/carts', {
        method: 'POST'
      })
      const data = await response.json()
      cartId = data.payload._id
      localStorage.setItem('cartId', cartId)
    }
    await fetch(`http://localhost:8080/api/carts/${cartId}/product/${productId}`, { method: 'POST' })
    alert('product added correctly')
    // updateCartBadge()
  } catch (error) {
    alert('failed to add to cart')
  }
}

async function updateCartBadge() {
  try {
    const cartId = localStorage.getItem('cartId')
    if (!cartId) {
      document.getElementById('badgeCart').textContent = ''
      return
    }

    const response = await fetch(`http://localhost:8080/api/carts/${cartId}`)
    const data = await response.json()

    if (data.payload && data.payload[0] && data.payload[0].products) {
      const cart = data.payload[0]
      const itemCount = cart.products.length
      document.getElementById('badgeCart').textContent = itemCount.toString()
    } else {
      document.getElementById('badgeCart').textContent = ''
    }
  } catch (error) {
    document.getElementById('badgeCart').textContent = ''
  }
}

// eslint-disable-next-line prefer-const
let userMail = ''
// eslint-disable-next-line space-before-function-paren
async function askEmail() {
  const { value: name } = await Swal.fire({
    title: 'Enter your mail',
    input: 'text',
    inputLabel: 'Your mail',
    inputValue: '',
    showCancelButton: false,
    inputValidator: (value) => {
      if (!value) {
        return 'You need to write your mail!'
      }
    }
  })
  userMail = name
}

askEmail()

const chatBox = document.getElementById('chat-box')

chatBox.addEventListener('keyup', ({ key }) => {
  if (key === 'Enter') {
    socket.emit('msg-front-to-back', {
      user: userMail,
      message: chatBox.value
    })
    chatBox.value = ''
  }
})

try {
  socket.on('productAdded', async (product) => {
    const container = document.getElementById('product-container')
    const productListElement = document.createElement('div')
    productListElement.innerHTML = `
              <div id="${product._id}" class="product">
                <h2>${product.title}</h2>
                <img src="${product.thumbnails}" alt="">
                <p><strong>Price:</strong> $${product.price}</p>
                <p><strong>Stock:</strong> ${product.stock}</p>
                <button class="delete-btn" onclick="deleteProductWithSocket('${product._id}')">Delete</button>
              </div>`

    container.appendChild(productListElement)
  })
  socket.on('product:deleted', (id) => {
    const div = document.getElementById(id)
    div.remove()
  })

  socket.on('msg-back-to-front', async (msgs) => {
    let formatedMsgs = ''
    msgs.forEach((msg) => {
      formatedMsgs += '<div style="border: 1px solid black">'
      formatedMsgs += '<p>' + msg.user + '</p>'
      formatedMsgs += '<p>' + msg.message + '</p>'
      formatedMsgs += '</div>'
    })
    const divMsgs = document.getElementById('div-msgs')
    divMsgs.innerHTML = formatedMsgs
  })
} catch (error) { }
