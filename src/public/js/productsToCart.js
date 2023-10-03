const socket = io();
socket.on("updatedProducts", (listProducts) => {
  let displayedProducts;
  const filteredProducts = listProducts.docs.filter(product => product.owner !== sessionUser._id);
  sessionUser.isPremium === 'false' ? displayedProducts = listProducts.docs : displayedProducts = filteredProducts;

  const tableBody = document.getElementById("dinamic-product-list");
  const tableRows = displayedProducts.map((product) => `
    <div class="card -dashboard" style="width: 18rem; margin-top: 10px;">
      <img src="img.png" class="card-img-top " alt="...">
      <div class="card-header backgroundTable">
        <h5 class="card-title">${product.title}</h5>
      </div>
      <ul class="list-group list-group-flush card-body-style">
        <li class="list-group-item card-subtitle" ;"> ${product.description}</li>
        <li class="list-group-item">Code: ${product.code}</li>
        <li class="list-group-item">Price: ${product.price}</li>
        <li class="list-group-item">Stock: ${product.stock}</li>
        <li class="list-group-item">Category: ${product.category}</li>
        <li class="list-group-item backgroundTable";">
          <a class="card-link btn btn-sm btn-outline-danger" onclick="removeFromCart('${product._id}')">Quitar</a>
          <a class="card-link btn btn-sm btn-outline-success" onclick="addToCart('${product._id}')">Agregar</a>
        </li>
      </ul>
    </div>
  `);

  tableBody.innerHTML = tableRows.join("");
  const pagination = document.querySelector('.pagination');

  const previousPage = listProducts.hasPrevPage
    ? `<li class="page-item"><a class="page-link" href="#" onclick="onFilterChange(${listProducts.prevPage})"><-- </a></li>`
    : '';
  const nextPage = listProducts.hasNextPage ?
    `<li class="page-item"><a class="page-link" href="#" onclick="onFilterChange(${listProducts.nextPage})"> --></a></li>` : '';

  const paginationHTML = `
    ${previousPage}
    <li class="page-item"><a class="page-link">${listProducts.page} de ${listProducts.totalPages} paginas</a></li>
    ${nextPage}
  `;

  pagination.innerHTML = paginationHTML;
});

socket.on("dinamic-list-cart", (cartUpdt) => {
  const cartBody = document.getElementById("dinamic-list-cart");
  const cartText = cartUpdt.cartProducts.map((cartProduct) => `
    <p class="card-text">${cartProduct.idProduct.title} x ${cartProduct.quantity}</p>  
  `);
  cartBody.innerHTML = cartText.join("");
});

function onFilterChange(page) {
  const filterLimit = parseInt(document.getElementById("filterLimit").value);
  const filterSort = document.getElementById("filterSort").value;
  const filterAttName = document.getElementById("filterAttName").value;
  const filterText = document.getElementById("filterText").value;
  const filterPage = page ? page : 1;
  socket.emit("onFilterChange", filterLimit, filterPage, filterSort, filterAttName, filterText);
}

function addToCart(productId) {
  socket.emit("addToCart", productId, sessionUser.idCart);
  Swal.fire({
    icon: 'success',
    title: 'Product Added',
    text: 'The product has been added to your cart.',
    showConfirmButton: false,
    timer: 1500,
  });
}


function deleteProductFromCart(productId) {
  console.log("removeFromCart called with productId:", sessionUser);
  socket.emit("removeFromCart", productId, sessionUser.idCart);
  Swal.fire({
    icon: 'success',
    title: 'Product Removed',
    text: 'The product has been removed from your cart.',
    showConfirmButton: false,
    timer: 1500,
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const inactiveUsers = document.querySelector("#inactiveUsers");

  if (inactiveUsers) {
    inactiveUsers.addEventListener("click", () => {
      fetch("/api/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.status === 204) {
            Swal.fire({
              icon: 'success',
              title: 'Inactive users deleted',
              showConfirmButton: false,
              timer: 1500,
            });
          } else {
            console.error("Failed to delete users.");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  }
});

function deleteProduct(productId) {
  fetch(`/products/delete/${productId}`, {
    method: 'DELETE',
  })
    .then((response) => {
      if (response.ok) {
        Swal.fire('Deleted!', 'Product deleted successfully', 'success');
      } else {
        Swal.fire('Error!', 'An error occurred while deleting the product', 'error');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      Swal.fire('Error!', 'An error occurred while deleting the product', 'error');
    });
}